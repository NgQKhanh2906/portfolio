import React from "react";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function GuestbookLoading() {
  return (
    <Container className="py-12 md:py-20 max-w-4xl">
      {/* Section Heading Skeleton */}
      <div className="mb-8 md:mb-12">
        <Skeleton className="h-4 w-28 mb-2" />
        <Skeleton className="h-8 sm:h-10 w-56 mb-3" />
        <Skeleton className="h-5 w-full max-w-md" />
      </div>

      <div className="space-y-8">
        {/* Auth / Form Skeleton Card */}
        <Card className="p-6 border-border bg-surface space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-full shrink-0 aspect-square" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <Skeleton className="h-8 w-24 rounded-md" />
          </div>

          <div className="border-t border-border pt-3 space-y-3">
            <Skeleton className="h-24 w-full rounded-lg" />
            <div className="flex justify-between items-center pt-1">
              <Skeleton className="h-3 w-36" />
              <Skeleton className="h-8 w-28 rounded-md" />
            </div>
          </div>
        </Card>

        {/* Entries List Header Skeleton */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-5 w-20 rounded-sm" />
          </div>

          {/* Entries Cards Skeleton */}
          <div className="space-y-3">
            {[1, 2, 3].map((index) => (
              <Card key={index} className="p-5 border-border bg-surface space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full shrink-0 aspect-square" />
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-4 w-12 rounded-sm" />
                      </div>
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-7 w-12 rounded-md" />
                </div>
                <div className="space-y-2 pt-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}
