# CampusEats: Navigation Notes (Viva Prep)

CampusEats is a food-ordering app for campus cafeterias. You browse cafeterias, view a menu,
open an item, add it to the cart, place an order and see the order details.

## 1. Navigation structure (3 navigators, nested)

```
NavigationContainer                      (App.js)
└─ Drawer Navigator  ← root              (src/navigation/RootDrawer.js)
   ├─ Home ─► Bottom Tab Navigator       (src/navigation/MainTabs.js)
   │          ├─ Browse ─► Native Stack  (src/navigation/BrowseStack.js)
   │          │            ├─ Cafeterias
   │          │            ├─ Menu
   │          │            └─ ItemDetails
   │          ├─ Cart
   │          └─ Orders ─► Native Stack  (src/navigation/OrdersStack.js)
   │                       ├─ OrdersList
   │                       └─ OrderDetails
   ├─ Favourites
   ├─ Profile
   └─ About
```

**Why this nesting?**
- **Drawer (root):** for sections you visit less often (Favourites, Profile, About).
- **Tabs:** for the 3 main areas the user keeps switching between (Browse, Cart, Orders).
- **Stack (inside a tab):** for drill-down flows (list → detail) where the user needs a back button.
  The stack sits *inside* the tab, so the tab bar stays visible while drilling down.

**Avoiding double headers:** each navigator can show its own header. `Home` (drawer) and the
`Browse`/`Orders` tabs set `headerShown: false`, so only the innermost stack shows a header.
Because those inner headers don't get the drawer's hamburger automatically, `MenuButton`
dispatches `DrawerActions.openDrawer()`, which bubbles up to the Drawer.

## 2. Passing data with route params

| From → To | Code | Params |
|---|---|---|
| Cafeterias → Menu | `CafeteriasScreen.js` | `{ cafeteriaId, name }` |
| Cafeterias ("Popular" card) → ItemDetails | `CafeteriasScreen.js` | `{ item, cafeteriaName }` |
| Menu → ItemDetails | `MenuScreen.js` | `{ item, cafeteriaName }` (a whole object) |
| OrdersList → OrderDetails | `OrdersScreen.js` | `{ orderId }` |
| Cart → OrderDetails (**another tab's stack**) | `CartScreen.js` | `navigate('Orders', { screen: 'OrderDetails', params: { orderId }, initial: false })` |
| Favourites → ItemDetails (**Drawer → Tab → Stack**) | `FavouritesScreen.js` | navigate with params nested two levels deep |

`initial: false` tells the nested stack to keep its first screen (e.g. OrdersList) underneath,
so the back button still works after jumping straight to a detail screen.

## 3. Displaying the received params

Read them with `route.params`:
- `MenuScreen`: `const { cafeteriaId, name } = route.params;`, shows the name and a
  "Received params" label, then looks up the menu using the id.
- `ItemDetailsScreen`: shows the item's name, price, description and cafeteria name.
- `OrderDetailsScreen`: uses `orderId` to find the order and shows its items and total.

## 4. Customizing headers

| Technique | Where |
|---|---|
| Shared flat style (background, tint, no shadow, bold title) via `screenOptions` | `headerOptions.js`, used by all navigators |
| **Custom title component** (`headerTitle: () => <LogoTitle />`) | `Cafeterias` in `BrowseStack.js` |
| Static title per screen (`title: 'My Cart'`, `'My Favourites'`, etc.) | `MainTabs.js`, `RootDrawer.js`, stacks |
| **Title AND colour taken from params**: `options={({ route }) => ({ title: route.params.name, headerStyle: { backgroundColor: cafeteria.color } })}` | `Menu` in `BrowseStack.js` (each cafeteria has its own header colour) |
| Title from params | `OrderDetails` in `OrdersStack.js` |
| **Options set inside the screen**: `navigation.setOptions({...})` in `useLayoutEffect`, with a **transparent header** (`headerTransparent: true`) over the coloured hero | `ItemDetailsScreen.js` |
| Different header colour for one screen (`headerStyle`) | `OrderDetails` (green), `About` (dark) |
| Back button shows only the arrow (`headerBackButtonDisplayMode: 'minimal'`) | both stacks |
| Hiding headers (`headerShown: false`) | `Home` drawer screen, `Browse`/`Orders` tabs |
| Custom drawer content (profile card + `DrawerItemList`) | `DrawerContent.js` |

## 5. Header buttons with real actions

| Screen | Button | Action |
|---|---|---|
| Cafeterias, Menu | 🛍️ cart with count badge (`headerRight`) | **Navigates** to the Cart tab |
| ItemDetails | ♡ / ❤️ heart (`headerRight` via `setOptions`) | **Updates data**: toggles favourite, and the icon updates |
| Cart | "Clear" (`headerRight`) | **Shows an Alert** asking for confirmation, then clears the cart |
| Profile | Log-out icon (`headerRight`) | **Shows an Alert** |
| Cafeterias, Cart, Orders | ☰ (`headerLeft`) | Opens the drawer |

Header buttons are in `src/components/HeaderButtons.js`. They use `useNavigation()` and
`useCart()` hooks, so they can navigate and change shared state from inside the header.

## 6. Shared state

`src/context/CartContext.js` is a React Context holding the cart, favourites and orders. It lets a
header button (e.g. the heart) change data that other screens (Favourites, Profile) show
straight away. This is ordinary React state; React Navigation has nothing to do with it.

## Demo script

1. Open the drawer (☰) and point out the Drawer → Tabs → Stack nesting.
2. Browse → tap **Desi Dhaba**: the header title comes from params, and so does the "Received params" label.
3. Tap **Chicken Biryani**: ItemDetails shows the item object passed as a param.
4. Tap ♡ in the header (updates data), then open the drawer → Favourites to see it listed.
5. Add to cart → the 🛍️ header badge and the tab badge update → tap 🛍️ in the header (navigates).
   Also tap a "🔥 Popular" card on the home screen: it passes params straight to ItemDetails.
6. Cart → **Clear** (Alert), add again → **Place order**: this jumps across tabs to OrderDetails with
   `orderId` (green header, title from params). Press back to reach OrdersList.
7. Favourites → tap an item: it navigates Drawer → Tab → Stack with nested params.

## Running

```
npm install
npx expo start
```
Scan the QR code with Expo Go, or press `w` to open it in the browser.

To run it straight in the browser:
```
npm run web
```
On web, `Alert.alert` does nothing, so the app uses `src/utils/alert.js`, which shows
browser dialogs instead (OK/Cancel, with a note saying what each one does).
