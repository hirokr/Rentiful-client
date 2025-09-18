import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";
import type { ComponentType } from "react";

import type { OurFileRouter } from "@/app/api/uploadthing/route";

export const UploadButton: ComponentType<any> = generateUploadButton<OurFileRouter>();
export const UploadDropzone: ComponentType<any> = generateUploadDropzone<OurFileRouter>();