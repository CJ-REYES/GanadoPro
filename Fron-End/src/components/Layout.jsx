
    import React from 'react';
    import { NavLink, Outlet, useLocation } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { LayoutDashboard, Package, DollarSign, Users, Truck, FileText, Settings, Sun, Moon } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { Separator } from '@/components/ui/separator';
    import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
    import {
      DropdownMenu,
      DropdownMenuContent,
      DropdownMenuItem,
      DropdownMenuLabel,
      DropdownMenuSeparator,
      DropdownMenuTrigger,
    } from '@/components/ui/dropdown-menu';
    import { cn } from '@/lib/utils';


   const navItems = [
  { to: '/layout', label: 'Panel Principal', icon: LayoutDashboard },
  { to: '/layout/ganado', label: 'Ganado', icon: Package },
  { to: '/layout/corrales', label: 'Corrales', icon: FileText },
  { to: '/layout/ordenes-venta', label: 'Órdenes de Venta', icon: DollarSign },
  { to: '/layout/compradores', label: 'Compradores', icon: Users },
  { to: '/layout/productores', label: 'Productores', icon: Users },
  { to: '/layout/exportacion', label: 'Inventario Exportación', icon: Truck },
];

    const SidebarNavLink = ({ to, children, icon: Icon }) => (
      <NavLink
        to={to}
        className={({ isActive }) =>
          cn(
            'flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out hover:bg-primary/10 hover:text-primary',
            isActive ? 'bg-primary/20 text-primary' : 'text-muted-foreground'
          )
        }
      >
        {Icon && <Icon className="mr-3 h-5 w-5 flex-shrink-0" />}
        <span className="truncate">{children}</span>
      </NavLink>
    );

    const Layout = () => {
      const [isDarkMode, setIsDarkMode] = React.useState(true);
      const location = useLocation();

      React.useEffect(() => {
        const root = window.document.documentElement;
        if (isDarkMode) {
          root.classList.add('dark');
          root.style.setProperty('--background', '224 71.4% 4.1%');
          root.style.setProperty('--foreground', '210 20% 98%');
          root.style.setProperty('--muted', '215 27.9% 16.9%');
          root.style.setProperty('--muted-foreground', '217.2 32.6% 50.0%');
          root.style.setProperty('--popover', '224 71.4% 4.1%');
          root.style.setProperty('--popover-foreground', '210 20% 98%');
          root.style.setProperty('--card', '220 40% 8%');
          root.style.setProperty('--card-foreground', '210 20% 98%');
          root.style.setProperty('--border', '215 27.9% 16.9%');
          root.style.setProperty('--input', '215 27.9% 16.9%');
          root.style.setProperty('--primary', '150 70% 50%');
          root.style.setProperty('--primary-foreground', '210 20% 98%');
          root.style.setProperty('--secondary', '217.2 32.6% 17.5%');
          root.style.setProperty('--secondary-foreground', '210 20% 98%');
          root.style.setProperty('--accent', '170 80% 45%');
          root.style.setProperty('--accent-foreground', '210 20% 98%');
          root.style.setProperty('--destructive', '0 62.8% 30.6%');
          root.style.setProperty('--destructive-foreground', '210 20% 98%');
          root.style.setProperty('--ring', '150 70% 50%');
        } else {
          root.classList.remove('dark');
          root.style.setProperty('--background', '0 0% 100%'); 
          root.style.setProperty('--foreground', '224 71.4% 4.1%'); 
          root.style.setProperty('--muted', '210 40% 96.1%'); 
          root.style.setProperty('--muted-foreground', '215.4 16.3% 46.9%'); 
          root.style.setProperty('--popover', '0 0% 100%');
          root.style.setProperty('--popover-foreground', '224 71.4% 4.1%');
          root.style.setProperty('--card', '0 0% 100%'); 
          root.style.setProperty('--card-foreground', '224 71.4% 4.1%'); 
          root.style.setProperty('--border', '214.3 31.8% 91.4%'); 
          root.style.setProperty('--input', '214.3 31.8% 91.4%'); 
          root.style.setProperty('--primary', '150 60% 45%'); 
          root.style.setProperty('--primary-foreground', '210 40% 98%'); 
          root.style.setProperty('--secondary', '210 40% 96.1%'); 
          root.style.setProperty('--secondary-foreground', '224 71.4% 4.1%'); 
          root.style.setProperty('--accent', '170 70% 40%'); 
          root.style.setProperty('--accent-foreground', '210 40% 98%'); 
          root.style.setProperty('--destructive', '0 84.2% 60.2%'); 
          root.style.setProperty('--destructive-foreground', '210 40% 98%'); 
          root.style.setProperty('--ring', '150 60% 45%'); 
        }
      }, [isDarkMode]);

      const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
      };
      
      return (
        <div className="flex h-screen bg-background text-foreground">
          <motion.aside
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-64 flex-shrink-0 border-r border-border/60 bg-card flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-center h-20 border-b border-border/60">
              <img  alt="Logo Control Ganadero" class="h-10 w-auto" src="https://images.unsplash.com/photo-1606920926813-fb89d0cf2c5d" />
              <h1 className="ml-2 text-2xl font-bold text-primary">GanadoPro</h1>
            </div>
            <nav className="flex-grow p-4 space-y-1.5 overflow-y-auto">
              {navItems.map((item) => (
                <SidebarNavLink key={item.to} to={item.to} icon={item.icon}>
                  {item.label}
                </SidebarNavLink>
              ))}
            </nav>
            <Separator className="my-2"/>
            <div className="p-4">
              <Button variant="outline" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Configuración
              </Button>
            </div>
          </motion.aside>

          <div className="flex-1 flex flex-col overflow-hidden">
            <header className="h-20 flex items-center justify-between px-6 border-b border-border/60 bg-card shadow-md">
              <div className="flex items-center">
                <h2 className="text-xl font-semibold">Control Ganadero</h2>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
                  {isDarkMode ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-blue-400" />}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src="https://source.unsplash.com/random/100x100/?portrait,person" alt="User Avatar" />
                        <AvatarFallback>CG</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">Usuario Admin</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          admin@ganadopro.com
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Perfil</DropdownMenuItem>
                    <DropdownMenuItem>Facturación</DropdownMenuItem>
                    <DropdownMenuItem>Ajustes</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Cerrar Sesión</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>
            <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 bg-background">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Outlet />
              </motion.div>
            </main>
          </div>
        </div>
      );
    };

    export default Layout;
  