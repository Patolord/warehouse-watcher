"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MessageCircleHeart } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useMediaQuery } from "@/hooks/use-media-query";

type FeedbackFormProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const feedbackSchema = z.object({
  name: z.string().min(2, {
    message: "Name is required",
  }),
  feedback: z.string().min(1, { message: "Feedback is required" }),
});

export default function FeedbackButton() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const description =
    "We value your feedback. How can we improve your experience?";

  if (!isDesktop) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <button>
              <MessageCircleHeart />
            </button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle>Feedback</DrawerTitle>
              <DrawerDescription>{description}</DrawerDescription>
            </DrawerHeader>
            <FeedbackForm setOpen={setOpen} />
            <DrawerFooter className="pt-2">
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button>
            <MessageCircleHeart />
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Feedback</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <FeedbackForm setOpen={setOpen} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function FeedbackForm({ setOpen }: FeedbackFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      name: "",
      feedback: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof feedbackSchema>) => {
    try {
      await fetch("https://projectplannerai.com/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          feedback: values.feedback,
          projectId: process.env.NEXT_PUBLIC_PROJECT_PLANNER_ID,
        }),
      });
      setOpen(false);
    } catch (error) {
      console.error("Failed to send feedback:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("grid items-start gap-4 px-4 sm:px-0")}
    >
      <div className="grid gap-2">
        <Label htmlFor="name">
          Your name <span className="text-red-600">*</span>
        </Label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input {...field} type="name" id="name" placeholder="John Doe" />
          )}
        />
        {errors.name && typeof errors.name.message === "string" && (
          <p className="text-red-600">{errors.name.message}</p>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="feedback">
          Your feedback <span className="text-red-600">*</span>
        </Label>
        <Controller
          name="feedback"
          control={control}
          render={({ field }) => (
            <textarea
              {...field}
              className="w-full h-32 text-sm border rounded-lg flex border-input bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Write how we can improve your experience."
            />
          )}
        />
        {errors.feedback && typeof errors.feedback.message === "string" && (
          <p className="text-red-600">{errors.feedback.message}</p>
        )}
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-4 h-4 w-4 animate-spin" />
              Sending feedback...
            </>
          ) : (
            "Send feedback"
          )}
        </Button>
      </div>
    </form>
  );
}
