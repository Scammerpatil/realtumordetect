"use client";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";

const Component = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <head>
        <title>TumorDetect-AI | Unmasking Deepfakes, Detecting Tumors</title>
        <meta
          name="description"
          content="TumorDetect-AI is an advanced AI-powered system that leverages Mask R-CNN to detect brain tumors and identify deepfake medical images. Using real and GAN-generated synthetic data, the model accurately segments tumors while flagging potentially manipulated medical scans. This project enhances medical diagnosis integrity and deepfake detection in healthcare imaging."
        />
      </head>
      <body className={`antialiased`}>
        <Toaster />
        <Navbar />
        {children}
      </body>
    </html>
  );
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Component>{children}</Component>;
}
