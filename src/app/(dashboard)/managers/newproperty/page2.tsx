"use client";

import { CustomFormField } from "@/components/FormField";
import Header from "@/components/Header";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { PropertyFormData, propertySchema } from "@/lib/schemas";
import { useCreatePropertyMutation, useGetAuthUserQuery } from "@/state/api";
import { AmenityEnum, HighlightEnum, PropertyTypeEnum } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const NewProperty = () => {
  const [createProperty] = useCreatePropertyMutation();
  const { data: authUser } = useGetAuthUserQuery();

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
    console.log("Form data before submission:", data); 
    if (!authUser?.cognitoInfo?.userId) {
      throw new Error("No manager ID found");
    }

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      console.log(`${key}:`, value); 
      if (key === "photoUrls") {
        const files = value as File[];
        files.forEach((file: File) => {
          formData.append("photos", file);
        });
      } else if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        console.log(`${key}:`, value); 
        formData.append(key, String(value));
      }
    });

    formData.append("managerId", authUser.cognitoInfo.userId);

    await createProperty(formData);
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
                {/* Amenities MultiSelect */}
                <FormField
                  control={form.control}
                  name="amenities"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Amenities</FormLabel>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {Object.keys(AmenityEnum).map((amenity) => (
                          <FormField
                            key={amenity}
                            control={form.control}
                            name="amenities"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={amenity}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(amenity)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, amenity])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== amenity
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal cursor-pointer">
                                    {amenity}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Highlights MultiSelect */}
                <FormField
                  control={form.control}
                  name="highlights"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Highlights</FormLabel>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {Object.keys(HighlightEnum).map((highlight) => (
                          <FormField
                            key={highlight}
                            control={form.control}
                            name="highlights"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={highlight}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(highlight)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, highlight])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== highlight
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal cursor-pointer">
                                    {highlight}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <hr className='my-6 border-gray-200' />

            {/* Photos */}
            <div>
              <h2 className='text-lg font-semibold mb-4'>Photos</h2>
              <CustomFormField
                name='photoUrls'
                label='Property Photos'
                type='file'
                accept='image/*'
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
              className='bg-primary-700 text-white w-full mt-8'
            >
              Create Property
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default NewProperty;