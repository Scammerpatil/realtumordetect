"use client";
import { IconCloudUpload } from "@tabler/icons-react";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import ReactImageMagnify from "react-image-magnify";

const DetectPage = () => {
  const [image, setImage] = useState<File>();
  const [preview, setPreview] = useState<string | null>(null);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const openZoomedImage = (imageUrl: string | null) => {
    setZoomedImage(imageUrl);
  };
  // Function to close zoomed image
  const closeZoomedImage = () => {
    setZoomedImage(null);
  };
  const [res, setRes] = useState({ label: "" });

  const handleUpload = () => {
    setRes({ label: "" });
    if (!image) {
      toast.error("Please upload an image");
      return;
    }

    const resPromise = axios.postForm("/api/detect", { image });
    toast.promise(resPromise, {
      loading: "Detecting...",
      success: (data) => {
        console.log(data);
        setRes(data.data);
        setImageUrl(data.data.imageUrl);
        return "Detection successful";
      },
      error: (err) => err.response?.data?.message || "Detection failed",
    });
  };

  return (
    <section className="bg-base-300 h-[calc(100vh-5.6rem)] flex items-center justify-center gap-5">
      {/* Upload Section */}
      <div className="bg-base-100 h-full p-10 w-full max-w-lg rounded-lg">
        <h1 className="text-2xl text-center uppercase font-semibold">
          Upload MRI Images
        </h1>
        <img
          src={preview || "/dummy-image-square.jpg"}
          alt="Preview"
          className="max-w-72 mt-6 mx-auto"
        />

        <div className="flex items-center justify-center max-w-lg w-full mt-6">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-full border-2 border-base-content border-dashed rounded-lg cursor-pointer bg-base-100"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <IconCloudUpload size={48} className="text-base-content" />
              <p className="mb-2 text-sm text-base-content">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-base-content/70">
                PNG, JPG (MAX. 800x400px)
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const files = e.target.files;
                if (files && files[0]) {
                  const file = files[0];
                  setImage(file);
                  setPreview(URL.createObjectURL(file));
                }
              }}
            />
          </label>
        </div>
        <button
          onClick={handleUpload}
          className="btn btn-primary mt-6 w-full"
          disabled={!image}
        >
          Verify Image
        </button>
      </div>

      {zoomedImage && (
        <div className="zoomed-image-container" onClick={closeZoomedImage}>
          <Image
            src={zoomedImage}
            alt="zoomed-image"
            layout="fill"
            objectFit="contain"
          />
        </div>
      )}

      {/* Detection Result Section */}
      <div className="bg-base-100 p-10 h-full w-full max-w-lg rounded-lg">
        <h1 className="text-2xl text-center uppercase font-semibold">
          Detection Result
        </h1>

        <div className="max-w-72 mt-6 mx-auto">
          {res?.label ? (
            <img
              src={imageUrl || "/dummy-image-square.jpg"}
              alt="Placeholder"
              className="max-w-72 mx-auto"
              onClick={() => openZoomedImage(imageUrl)}
            />
          ) : (
            <img
              src="/dummy-image-square.jpg"
              alt="Placeholder"
              className="max-w-72 mx-auto"
            />
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center max-w-lg w-full mt-6">
          <button
            className={`btn mx-1 my-2 ${
              res.label === "Real Tumor" ? "btn-primary" : ""
            }`}
          >
            Real Tumor Detected
          </button>
          <button
            className={`btn mx-1 my-2 ${
              res.label === "No Tumor" ? "btn-primary" : ""
            }`}
          >
            No Tumor Detected But Real Image
          </button>
          <button
            className={`btn mx-1 my-2 ${
              res.label === "Deepfake Tumor" ? "btn-primary" : ""
            }`}
          >
            Deepfake Tumor Detected
          </button>
          <button
            className={`btn mx-1 my-2 ${
              res.label === "Deepfake No Tumor" ? "btn-primary" : ""
            }`}
          >
            Deepfake Tumor Removed Detected
          </button>
        </div>
      </div>
    </section>
  );
};

export default DetectPage;
