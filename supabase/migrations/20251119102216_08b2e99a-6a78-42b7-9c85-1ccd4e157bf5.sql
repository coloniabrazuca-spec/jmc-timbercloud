-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'operator');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create suppliers table (fornecedores)
CREATE TABLE public.suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

-- Create wood_stock table (estoque de madeira)
CREATE TABLE public.wood_stock (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wood_type TEXT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'm³',
  supplier_id UUID REFERENCES public.suppliers(id),
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.wood_stock ENABLE ROW LEVEL SECURITY;

-- Create trucks table (registro de caminhões)
CREATE TABLE public.trucks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  license_plate TEXT NOT NULL,
  driver_name TEXT NOT NULL,
  supplier_id UUID REFERENCES public.suppliers(id),
  wood_type TEXT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  unit TEXT NOT NULL DEFAULT 'm³',
  delivery_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.trucks ENABLE ROW LEVEL SECURITY;

-- Create pallet_production table (produção de paletes)
CREATE TABLE public.pallet_production (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quantity INTEGER NOT NULL,
  pallet_size TEXT NOT NULL,
  wood_consumed DECIMAL(10,2) NOT NULL,
  operator_name TEXT,
  production_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.pallet_production ENABLE ROW LEVEL SECURITY;

-- Create sales table (vendas)
CREATE TABLE public.sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_name TEXT NOT NULL,
  buyer_contact TEXT,
  product_type TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  sale_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles"
  ON public.user_roles FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
  ON public.user_roles FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for suppliers
CREATE POLICY "Authenticated users can view suppliers"
  ON public.suppliers FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert suppliers"
  ON public.suppliers FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update suppliers"
  ON public.suppliers FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete suppliers"
  ON public.suppliers FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for wood_stock
CREATE POLICY "Authenticated users can view wood stock"
  ON public.wood_stock FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert wood stock"
  ON public.wood_stock FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update wood stock"
  ON public.wood_stock FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete wood stock"
  ON public.wood_stock FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for trucks
CREATE POLICY "Authenticated users can view trucks"
  ON public.trucks FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert trucks"
  ON public.trucks FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update trucks"
  ON public.trucks FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete trucks"
  ON public.trucks FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for pallet_production
CREATE POLICY "Authenticated users can view production"
  ON public.pallet_production FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert production"
  ON public.pallet_production FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update production"
  ON public.pallet_production FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete production"
  ON public.pallet_production FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for sales
CREATE POLICY "Authenticated users can view sales"
  ON public.sales FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert sales"
  ON public.sales FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update sales"
  ON public.sales FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete sales"
  ON public.sales FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Trigger function for profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  
  -- First user becomes admin
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'operator');
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();