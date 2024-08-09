import { navItems } from "./nav-items";

const App = () => (
  <div>
    {navItems.map(({ to, page }) => (
      <div key={to}>{page}</div>
    ))}
  </div>
);

export default App;
