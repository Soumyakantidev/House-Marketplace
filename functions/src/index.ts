import { onDocumentDeleted } from "firebase-functions/v2/firestore";
import { logger } from "firebase-functions";
import { initializeApp } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

initializeApp();

/**
 * Extracts the Storage object path ("images/abc123-photo.jpg") out of a
 * Firebase download URL ("https://firebasestorage.googleapis.com/v0/b/
 * <bucket>/o/images%2Fabc123-photo.jpg?alt=media&token=..."). The client
 * only ever stores the download URL on the listing doc, so this is the
 * only way to get back to the file the Admin SDK can delete.
 */
function storagePathFromDownloadUrl(url: string): string | null {
  const match = url.match(/\/o\/(.+)\?/);
  if (!match) return null;
  return decodeURIComponent(match[1]);
}

// Fires whenever a document under `listings/{listingId}` is deleted -
// e.g. by Profile.tsx calling deleteDoc(doc(db, "listings", listingId)).
// The client only removes the Firestore doc; this trigger does the part
// the client can't be trusted (or trusted to remember) to do: clean up
// the images that were uploaded for that listing.
export const cleanupListingImages = onDocumentDeleted(
  "listings/{listingId}",
  async (event) => {
    const listing = event.data?.data();
    const imgUrls: string[] | undefined = listing?.imgUrls;

    if (!imgUrls || imgUrls.length === 0) {
      logger.info(`No images to clean up for listing ${event.params.listingId}`);
      return;
    }

    const bucket = getStorage().bucket();

    const results = await Promise.allSettled(
      imgUrls.map((url) => {
        const path = storagePathFromDownloadUrl(url);
        if (!path) {
          logger.warn(`Could not parse storage path from URL: ${url}`);
          return Promise.resolve();
        }
        return bucket.file(path).delete();
      })
    );

    const failures = results.filter((r) => r.status === "rejected");
    if (failures.length > 0) {
      logger.error(
        `Failed to delete ${failures.length}/${imgUrls.length} images for listing ${event.params.listingId}`,
        failures
      );
    } else {
      logger.info(
        `Deleted ${imgUrls.length} image(s) for listing ${event.params.listingId}`
      );
    }
  }
);
