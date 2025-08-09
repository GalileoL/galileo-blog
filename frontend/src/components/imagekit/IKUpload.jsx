import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/react";
import { useRef, useState } from "react";

// TBD: Implement the IKUpload component

const IKUpload = ({
  children,
  type = "image",
  setProgress,
  setData,
  className,
  accept,
}) => {
  const [busy, setBusy] = useState(false);
  const inputRef = useRef(null);
  const abortRef = useRef(null);
  // this is for authentication with ImageKit for uploading images
  const authenticator = async () => {
    try {
      // Perform the request to the upload authentication endpoint.
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/posts/upload-auth`
      );
      if (!response.ok) {
        // If the server response is not successful, extract the error text for debugging.
        const errorText = await response.text();
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`
        );
      }

      console.log("Authentication request successful:", response);

      // Parse and destructure the response JSON for upload credentials.
      const data = await response.json();
      console.log("Upload authentication data:", data);
      const {
        signature,
        expire,
        token,
        publicKey = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY,
      } = data;
      return { signature, expire, token, publicKey };
    } catch (error) {
      // Log the original error for debugging before rethrowing a new error.
      console.error("Authentication error:", error);
      throw new Error("Authentication request failed");
    }
  };

  //   single file upload handler
  const handleSingleFileUpload = async (file, auth) => {
    const urlEndpoint = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;
    abortRef.current = new AbortController();

    const res = await upload({
      file,
      fileName: file.name,
      expire: auth.expire,
      token: auth.token,
      publicKey: auth.publicKey,
      signature: auth.signature,
      urlEndpoint,
      onProgress: (event) => {
        // process percentage progress
        if (event && event.total) {
          const percentage = Math.round((event.loaded / event.total) * 100);
          setProgress(percentage);
        }
        //   console.log("Upload progress:", progress);
      },
      abortSignal: abortRef.current.signal,
    });

    return res;
  };

  //   TBD: handle multiple file uploads
  // TBD:handle upload in chunks

  const handlePick = async (files) => {
    // check if file is null or undefined
    if (!files || files.length === 0) {
      alert("No files selected");
      return;
    }

    const file = files[0]; // For single file upload, use the first file

    setBusy(true);

    // Use the authenticator to get the upload credentials.
    try {
      const auth = await authenticator();
      console.log("Upload authentication successful:", auth);
      const res = await handleSingleFileUpload(file, auth);
      console.log("Upload response:", res);

      setData(res);
    } catch (err) {
      // error handling for different ImageKit errors
      if (err instanceof ImageKitAbortError) {
        console.error("Upload aborted:", err.reason);
      } else if (err instanceof ImageKitInvalidRequestError) {
        console.error("Invalid request:", err.message);
      } else if (err instanceof ImageKitUploadNetworkError) {
        console.error("Network error:", err.message);
      } else if (err instanceof ImageKitServerError) {
        console.error("Server error:", err.message);
      } else {
        console.error("Upload error:", err);
      }
    } finally {
      setBusy(false);
      // abortRef.current = null;
    }
  };

  const triggerPick = () => {
    if (!busy) {
      inputRef.current?.click();
    }
  };

  const cancelUpload = () => {
    if (abortRef.current) {
      abortRef.current.abort("user cancelled");
    }
  };

  return (
    <div
      className={className ?? "cursor-pointer"}
      onClick={triggerPick}
      aria-disabled={busy}
    >
      <input
        type="file"
        ref={inputRef}
        onChange={(e) => {
          handlePick(e.target.files);
          e.target.value = null; // Reset input value to allow re-uploading the same file
        }}
        className="hidden"
        accept={accept ?? `${type}/*`}
      />
      {children}
    </div>
  );
};

export default IKUpload;
