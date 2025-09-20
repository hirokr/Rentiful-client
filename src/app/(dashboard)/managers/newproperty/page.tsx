"use client";

import { CustomFormField } from "@/components/FormField";
import Header from "@/components/Header";
import { Form } from "@/components/ui/form";
import { PropertyFormData, propertySchema } from "@/lib/schemas";
import { useCreatePropertyMutation } from "@/state/api";
import { AmenityEnum, HighlightEnum, PropertyTypeEnum } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { PropertyImageUpload, StagedImage } from "@/components/PropertyImageUpload";
import { toast } from "sonner";

const NewProperty = () => {
  const [createProperty] = useCreatePropertyMutation();
  const { data: session } = useSession();
  const [stagedImages, setStagedImages] = useState<StagedImage[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      name: "",
      description: "",
      pricePerMonth: 1000,
      securityDeposit: 500,
      applicationFee: 100,
      isPetsAllowed: true,
      isParkingIncluded: true,
      photoUrls: [],
      amenities: [],
      highlights: [],
      beds: 1,
      baths: 1,
      squareFeet: 1000,
      address: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
    },
  });

  const onSubmit = async (data: PropertyFormData) => {
    if (!session?.user?.id) {
      toast.error("No manager ID found");
      return;
    }

    if (stagedImages.length === 0) {
      toast.error("Please add at least one image");
      return;
    }

    setIsCreating(true);

    try {
      // Check if there are any unuploaded images and upload them first
      const unuploadedImages = stagedImages.filter(img => !img.uploaded);
      let finalImageUrls: string[] = [];

      if (unuploadedImages.length > 0) {
        // Upload remaining images automatically
        const uploadedUrls = await uploadStagedImages();
        if (!uploadedUrls) {
          throw new Error("Failed to upload images");
        }

        // Combine already uploaded URLs with newly uploaded ones
        const alreadyUploadedUrls = stagedImages
          .filter(img => img.uploaded && img.url)
          .map(img => img.url!);

        finalImageUrls = [...alreadyUploadedUrls, ...uploadedUrls];
      } else {
        // All images are already uploaded
        finalImageUrls = stagedImages
          .filter(img => img.uploaded && img.url)
          .map(img => img.url!);
      }

      // Update form data with uploaded URLs
      const propertyData = {
        ...data,
        photoUrls: finalImageUrls,
      };

      const formData = new FormData();
      Object.entries(propertyData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      });

      await createProperty(formData).unwrap();
      toast.success("Property created successfully!");

      // Reset form and images
      form.reset();
      setStagedImages([]);

    } catch (error) {
      console.error("Error creating property:", error);
      toast.error("Failed to create property. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  // Function to upload staged images and return URLs
  const uploadStagedImages = (): Promise<string[] | null> => {
    return new Promise((resolve) => {
      const unuploadedImages = stagedImages.filter(img => !img.uploaded);
      if (unuploadedImages.length === 0) {
        resolve([]);
        return;
      }

      // Trigger upload from the PropertyImageUpload component
      const uploadEvent = new CustomEvent('uploadStagedImages', {
        detail: {
          callback: (urls: string[] | null) => resolve(urls)
        }
      });
      window.dispatchEvent(uploadEvent);
    });
  };

  return (
    <div className='dashboard-container'>
      <Header
        title='Add New Property'
        subtitle='Create a new property listing with detailed information'
      />
      <div className='bg-white rounded-xl p-6'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='p-4 space-y-10'
          >
            {/* Basic Information */}
            <div>
              <h2 className='text-lg font-semibold mb-4'>Basic Information</h2>
              <div className='space-y-4'>
                <CustomFormField name='name' label='Property Name' />
                <CustomFormField
                  name='description'
                  label='Description'
                  type='textarea'
                />
              </div>
            </div>

            <hr className='my-6 border-gray-200' />

            {/* Fees */}
            <div className='space-y-6'>
              <h2 className='text-lg font-semibold mb-4'>Fees</h2>
              <CustomFormField
                name='pricePerMonth'
                label='Price per Month'
                type='number'
              />
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <CustomFormField
                  name='securityDeposit'
                  label='Security Deposit'
                  type='number'
                />
                <CustomFormField
                  name='applicationFee'
                  label='Application Fee'
                  type='number'
                />
              </div>
            </div>

            <hr className='my-6 border-gray-200' />

            {/* Property Details */}
            <div className='space-y-6'>
              <h2 className='text-lg font-semibold mb-4'>Property Details</h2>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <CustomFormField
                  name='beds'
                  label='Number of Beds'
                  type='number'
                />
                <CustomFormField
                  name='baths'
                  label='Number of Baths'
                  type='number'
                />
                <CustomFormField
                  name='squareFeet'
                  label='Square Feet'
                  type='number'
                />
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
                <CustomFormField
                  name='isPetsAllowed'
                  label='Pets Allowed'
                  type='switch'
                />
                <CustomFormField
                  name='isParkingIncluded'
                  label='Parking Included'
                  type='switch'
                />
              </div>
              <div className='mt-4'>
                <CustomFormField
                  name='propertyType'
                  label='Property Type'
                  type='select'
                  options={Object.keys(PropertyTypeEnum).map((type) => ({
                    value: type,
                    label: type,
                  }))}
                />
              </div>
            </div>

            <hr className='my-6 border-gray-200' />

            {/* Amenities and Highlights */}
            <div>
              <h2 className='text-lg font-semibold mb-4'>
                Amenities and Highlights
              </h2>
              <div className='space-y-6'>
                <CustomFormField
                  name='amenities'
                  label='Amenities'
                  type='multiSelect'
                  options={Object.keys(AmenityEnum).map((amenity) => ({
                    value: amenity,
                    label: amenity,
                  }))}
                />
                <CustomFormField
                  name='highlights'
                  label='Highlights'
                  type='multiSelect'
                  options={Object.keys(HighlightEnum).map((highlight) => ({
                    value: highlight,
                    label: highlight,
                  }))}
                />
              </div>
            </div>

            <hr className='my-6 border-gray-200' />

            {/* Photos */}
            <div>
              <h2 className='text-lg font-semibold mb-4'>Photos</h2>
              <PropertyImageUpload
                onImagesChange={setStagedImages}
                maxImages={10}
              />
            </div>

            <hr className='my-6 border-gray-200' />

            {/* Additional Information */}
            <div className='space-y-6'>
              <h2 className='text-lg font-semibold mb-4'>
                Additional Information
              </h2>
              <CustomFormField name='address' label='Address' />
              <div className='flex justify-between gap-4'>
                <CustomFormField name='city' label='City' className='w-full' />
                <CustomFormField
                  name='state'
                  label='State'
                  className='w-full'
                />
                <CustomFormField
                  name='postalCode'
                  label='Postal Code'
                  className='w-full'
                />
              </div>
              <CustomFormField name='country' label='Country' />
            </div>

            <Button
              type='submit'
              disabled={isCreating}
              className='bg-primary-700 text-white w-full mt-8'
            >
              {isCreating ? "Creating Property..." : "Create Property"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default NewProperty;
