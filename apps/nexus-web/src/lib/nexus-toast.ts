/**
 * @file nexus-toast.ts
 * @description Drop-in replacement for react-toastify's `toast` helper.
 *
 * Usage — identical to react-toastify, just change the import:
 *   import { toast } from "@/lib/nexus-toast";
 *   toast.success("Done!") / toast.error("Oops!") / toast.info(...) / toast.warning(...)
 */

export { nexusToast as toast } from "@/components/shared/NexusToast";
