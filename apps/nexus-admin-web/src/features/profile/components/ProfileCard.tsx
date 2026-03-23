"use client";

import { useMe } from "../hooks";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { ChangeEmailDialog } from "./ChangeEmailDialog";
import { ChangePasswordDialog } from "./ChangePasswordDialog";
import { useState } from "react";

export const ProfileCard = () => {
  const { data: user, isLoading, error } = useMe();
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  if (isLoading) {
    return <Skeleton className="w-full h-[400px]" />;
  }

  if (error || !user) {
    return (
      <Card className="border-red-500">
        <CardHeader>
          <CardTitle className="text-red-500">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Failed to load profile information.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-20 w-20" alt={user.display_name ?? ""}>
            {user.display_name?.charAt(0)}
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{user.display_name}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">User ID</p>
              <p className="font-mono text-sm">{user.id}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">GDG ID</p>
              <p className="font-mono text-sm">{user.gdg_id || "Not assigned"}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 pt-4">
            <Button onClick={() => setIsEmailDialogOpen(true)}>
              Change Email
            </Button>
            <Button variant="outline" onClick={() => setIsPasswordDialogOpen(true)}>
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>

      <ChangeEmailDialog 
        open={isEmailDialogOpen} 
        onOpenChange={setIsEmailDialogOpen} 
      />
      <ChangePasswordDialog 
        open={isPasswordDialogOpen} 
        onOpenChange={setIsPasswordDialogOpen} 
      />
    </div>
  );
};
