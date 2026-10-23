import { browserApi } from "@/shared/api/client";
import type {
  Contact,
  ReplaceContactsInput,
  UpdateProfileInput,
  UserProfile,
} from "@/shared/api/types";

export const profileApi = {
  update: (input: UpdateProfileInput) =>
    browserApi<UserProfile>("/users/me", {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  replaceContacts: (input: ReplaceContactsInput) =>
    browserApi<Contact[]>("/users/me/contacts", {
      method: "PUT",
      body: JSON.stringify(input),
    }),
};
