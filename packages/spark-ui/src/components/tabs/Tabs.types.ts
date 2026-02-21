import type { VariantProps } from "class-variance-authority";
import type { tabsListStyles, tabsTriggerStyles, tabsContentStyles } from "./Tabs.styles";

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The default active tab value
   */
  defaultValue?: string;
  /**
   * The controlled active tab value
   */
  value?: string;
  /**
   * Callback when tab changes
   */
  onValueChange?: (value: string) => void;
}

export interface TabsListProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tabsListStyles> {}

export interface TabsTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof tabsTriggerStyles> {
  /**
   * The value that identifies this tab
   */
  value: string;
  /**
   * Whether this tab is active
   */
  isActive?: boolean;
}

export interface TabsContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tabsContentStyles> {
  /**
   * The value that identifies this content panel
   */
  value: string;
}
