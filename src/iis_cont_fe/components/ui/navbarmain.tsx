import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import { Input } from "@/components/ui/input"

const NavigationMenuComponent = () => {
return (<>
    <NavigationMenu>
    <NavigationMenuList>
    <NavigationMenuItem>
        <Link href="/" legacyBehavior passHref className="text-xl font-bold text-white">
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            <p className="text-xl font-bold">
              FITstagram
              </p>
          </NavigationMenuLink>
        </Link>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <Link href="/" legacyBehavior passHref>
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            Home
          </NavigationMenuLink>
        </Link>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <Link href="/docs" legacyBehavior passHref>
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            Create Post
          </NavigationMenuLink>
        </Link>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <Link href="/docs" legacyBehavior passHref>
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            Create Group
          </NavigationMenuLink>
        </Link>
      </NavigationMenuItem>
    </NavigationMenuList>
    <Input type="search" placeholder="Search"/>
  </NavigationMenu>
  </>);
};

export default NavigationMenuComponent;