import React, { useState } from "react";
import { api } from "../../../../../convex/_generated/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { Loader2, MapPin, AlertTriangle } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import dynamic from "next/dynamic";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

const MapSelector = dynamic(() => import("./MapSelector"), {
  ssr: false,
});

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Name must contain at least 3 characters",
  }),
  address: z.string().min(1, {
    message: "Address is required",
  }),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [addressNotFound, setAddressNotFound] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      latitude: 37.7749, // San Francisco coordinates as default
      longitude: -122.4194,
    },
  });

  const createWarehouse = useMutation(api.warehouses.createWarehouse);

  const onSubmit = async (values: FormValues) => {
    await createWarehouse({
      name: values.name,
      address: values.address,
      latitude: values.latitude,
      longitude: values.longitude,
    });

    form.reset();
    setIsDialogOpen(false);
    toast.success("Warehouse created successfully");
  };

  const handleLocationChange = (lat: number, lng: number, address: string) => {
    form.setValue("latitude", lat);
    form.setValue("longitude", lng);
    form.setValue("address", address);
    setAddressNotFound(false);
  };

  const geocodeAddress = async () => {
    const address = form.getValues("address");
    if (!address) {
      toast.error("Please enter an address before updating the map.");
      return;
    }

    setIsGeocoding(true);
    setAddressNotFound(false);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        handleLocationChange(parseFloat(lat), parseFloat(lon), address);
        toast.success("Map updated successfully.");
      } else {
        setAddressNotFound(true);
        toast.error("Address not found. Please adjust manually on the map.");
      }
    } catch (error) {
      console.error("Error geocoding address:", error);
      setAddressNotFound(true);
      toast.error(
        "Error searching address. Please adjust manually on the map."
      );
    } finally {
      setIsGeocoding(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>Add Warehouse</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Warehouse</DialogTitle>
          <DialogDescription>
            Enter the warehouse details and adjust the location on the map.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Warehouse name" {...field} />
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
                      <Input placeholder="Full address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                onClick={geocodeAddress}
                disabled={isGeocoding}
                className="flex gap-1"
              >
                {isGeocoding && <Loader2 className="h-4 w-4 animate-spin" />}
                Update Map
              </Button>

              {addressNotFound && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Address not found. Please adjust manually on the map.
                  </AlertDescription>
                </Alert>
              )}

              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <div className="h-[200px] sm:h-[300px]">
                    <MapSelector
                      latitude={form.watch("latitude")}
                      longitude={form.watch("longitude")}
                      onLocationChange={handleLocationChange}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>

              <div className="flex items-center space-x-2 text-yellow-600">
                <MapPin className="h-4 w-4" />
                <p className="text-sm">
                  Adjust the location on the map if necessary for greater
                  accuracy.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="flex gap-1"
              >
                {form.formState.isSubmitting && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
