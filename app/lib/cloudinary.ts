const CLOUDINARY_CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim();
const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET?.trim();
const CLOUDINARY_DEFAULT_FOLDER =
  process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER?.trim();

interface CloudinaryUploadOptions {
  folder?: string;
}

interface CloudinaryUploadResponse {
  secure_url?: string;
  public_id?: string;
}

export async function uploadImageToCloudinary(
  file: File,
  options: CloudinaryUploadOptions = {},
) {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error(
      "Cloudinary is not configured. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.",
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  const folder = options.folder || CLOUDINARY_DEFAULT_FOLDER;
  if (folder) {
    formData.append("folder", folder);
  }

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  const data = (await response.json()) as CloudinaryUploadResponse & {
    error?: { message?: string };
  };

  if (!response.ok || !data.secure_url) {
    throw new Error(
      data.error?.message || "Cloudinary upload failed. Please try again.",
    );
  }

  return {
    publicId: data.public_id || "",
    secureUrl: data.secure_url,
  };
}
