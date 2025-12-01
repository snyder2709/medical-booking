<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const { logout, user } = useAuth();

const signOut = () => {
  logout();
};
</script>

<template>
  <header
    class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur"
  >
    <div class="container mx-auto flex h-16 items-center justify-between">
      <NuxtLink to="/" class="flex items-center space-x-2">
        <span class="text-xl font-bold">МедБукинг</span>
      </NuxtLink>

      <DropdownMenu v-if="user !== null">
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="lg" class="flex items-center gap-2">
            <Avatar>
              <AvatarImage :src="user.avatar" :alt="user.name" />
              <AvatarFallback>{{
                user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
              }}</AvatarFallback>
            </Avatar>
            <span class="hidden sm:inline">{{ user.name }}</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent class="w-max-56 p-2">
          <Card>
            <CardHeader>
              <CardTitle class="text-sm">{{ user?.name }}</CardTitle>
              <p class="text-xs text-muted-foreground">{{ user?.email }}</p>
            </CardHeader>
            <CardContent
              class="flex flex-col gap-1 text-sm text-muted-foreground"
            >
              <p><strong>Телефон:</strong> {{ user?.phone }}</p>
              <p>
                <strong>Дата регистрации:</strong>
                <NuxtTime
                  :datetime="user?.registrationDate"
                  year="numeric"
                  month="2-digit"
                  day="2-digit"
                  hour="2-digit"
                  minute="2-digit"
                  locale="ru-RU"
                />
              </p>
              <Button class="mt-2" @click="signOut">Выйти</Button>
            </CardContent>
          </Card>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </header>
</template>
