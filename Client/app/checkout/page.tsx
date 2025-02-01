"use client";
import React, { useState, useEffect } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cities } from "@/constants";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import PhotosUploader from "@/components/checkout/uploader";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import useAuthStore from "@/store/authStore";
import SEO from "@/components/seo";
const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),
  email: z.string().email(),
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 characters long" }),
  address: z
    .string()
    .min(10, { message: "Address must be at least 10 characters long" }),
  city: z.string().min(3, { message: "City is not selected" }),
  country: z
    .string()
    .min(3, { message: "Country must be at least 3 characters long" }),
  postalCode: z
    .string()
    .min(3, { message: "Postal code must be at least 3 characters long" }),
});
const page = () => {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [images, setImages] = useState([]);
  const { user, token } = useAuthStore();
  const [delivery, setDelivery] = useState(300);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
      city: "",
      country: "",
      postalCode: "",
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (paymentMethod == "bank" && images.length == 0) {
      toast.error("Please upload the transaction receipt");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/order`,
        {
          name: values.name,
          email: values.email,
          phone: values.phone,
          order: items.map((item) => ({
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            image: item.product.images[0],
            price: item.product.finalPrice,
            name: item.product.name,
          })),
          shippingAddress: {
            address: values.address,
            city: values.city,
            postalCode: values.postalCode,
            country: values.country,
          },
          paymentMethod,
          paymentReceipt: images[0] || "",
          subTotal: getTotalPrice(),
          delivery: delivery,
          total: getTotalPrice() + delivery,
        }
      );
      toast.success(response.data.message || "Order placed successfully");
      clearCart(user ? true : false, token);
      router.push("/");
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
    setIsSubmitting(false);
    form.reset();
  }

  useEffect(() => {
    if (items.length === 0) {
      router.push("/");
    }
  }, [items]);

  return (
    <div className="pt-28 pb-10 px-6 md:px-12 lg:px-24 min-h-screen">
      <SEO
        title="Checkout | DastKari"
        description="Fill in your details to place your order. We will deliver it to you as soon as possible."
      />
      <div className="text-center mb-5 flex flex-col items-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-mons tracking-wide">
          Checkout
        </h1>
        <p className="text-sm md:text-base mt-4 text-gray-600 max-w-2xl">
          Fill in your details to place your order. We will deliver it to you as
          soon as possible.
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-10">
        <div className="w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <h2 className="text-xs font-bold">Personal Info</h2>
              <div className="border-y py-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder=""
                          {...field}
                          disabled={user ? true : false}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder=""
                          {...field}
                          disabled={user ? true : false}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input
                          placeholder=""
                          {...field}
                          disabled={user ? true : false}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder=""
                          {...field}
                          disabled={user ? true : false}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-3">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem className="w-1/3">
                        <FormLabel>City</FormLabel>
                        <Select
                          onValueChange={(e) => {
                            field.onChange(e);
                            setDelivery(e == "Lahore" ? 0 : 300);
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="rounded-none">
                              <SelectValue placeholder="City" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {cities.map((city) => (
                              <SelectItem key={city} value={city}>
                                {city}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem className="w-1/3">
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem className="w-1/3">
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <h2 className="text-xs font-bold">Payment Info:</h2>
              <div className="border-y py-5">
                <RadioGroup
                  defaultValue={paymentMethod}
                  onValueChange={(e) => setPaymentMethod(e)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bank" id="bank" />
                    <Label htmlFor="bank">Bank Transfer</Label>
                  </div>
                  {paymentMethod == "bank" && (
                    <div className="my-1 p-2  border border-black">
                      <p className="text-xs">
                        Please transfer the total amount to the following bank
                        account: <br />
                        Title:{" "}
                        <span className="font-semibold font-mons">
                          Hafiz Muhammad Umair
                        </span>
                        <br />
                        Account Number:{" "}
                        <span className="font-semibold font-mons">
                          0304 4105720
                        </span>
                        <br />
                        Bank Name:{" "}
                        <span className="font-semibold font-mons">
                          Easypaisa
                        </span>
                        <br />
                        <p className="text-xs">
                          After transferring the amount, please attach the
                          transaction receipt below to confirm your order.
                        </p>
                      </p>
                      <PhotosUploader
                        maxPhotos={1}
                        addedPhotos={images}
                        onChange={(photos: any) => setImages(photos)}
                      />
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod">Cash on Delivery (COD)</Label>
                  </div>
                </RadioGroup>
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded-none font-mons w-full bg-secondary py-3  text-white transition duration-200"
              >
                {isSubmitting ? "Submitting..." : "Place Order"}
              </Button>
            </form>
          </Form>
        </div>
        <div className="md:pl-10 w-full md:border-l border-neutral-600">
          <h2 className="text-2xl font-mons mb-5">Your Cart</h2>
          {items.map((item) => (
            <div
              key={item.product._id}
              className="border border-black p-2 my-2 flex justify-between"
            >
              <div className="w-2/3">
                <img
                  src={item.product.images[0]}
                  alt=""
                  className="w-20 h-20 object-cover float-left mr-3.5"
                />
                <h1 className="font-mons">{item.product.name}</h1>
                <h1 className="text-xs">Size: {item.size.toUpperCase()}</h1>
                <h1 className="text-xs">
                  Color: {item.color[0].toUpperCase() + item.color.slice(1)}
                </h1>
                <h1 className="text-xs">Qty: {item.quantity}</h1>
              </div>
              <span className="font-mons">
                PKR {item.product.finalPrice.toLocaleString()}
              </span>
            </div>
          ))}
          <div className="mt-10">
            <div className="flex justify-between">
              <p>Subtotal</p>
              <p>PKR {getTotalPrice().toLocaleString()}</p>
            </div>
            <div className="flex justify-between">
              <p>Delivery</p>
              <p>{delivery == 0 ? "Free" : "PKR 300"}</p>
            </div>
            <div className="flex justify-between">
              <p>Total</p>
              <p>PKR {(getTotalPrice() + delivery).toLocaleString()} </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
