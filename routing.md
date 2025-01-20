# Recovery Cashback - Architecture and Structure

## Project Overview
The project is a cashback credit card comparison application built with React and React Router. The application consists of two main parts:
1. Public Frontend: For users to compare credit cards and view information
2. Admin Dashboard: For managing the application's content and settings

## Routing Structure
The application uses React Router (not Next.js) for routing. Here's the complete routing structure:

### Public Routes
- `/` - Home page
- `/auth/login` - Login page
- `/:slug` - Dynamic pages (blog posts, static pages)

### Admin Dashboard Routes
All admin routes are protected by `AuthGuard` and use the `SidebarProvider` layout.
Base path: `/admin/*`

```typescript
/admin/
├── / (Dashboard)
├── /banks
├── /credit-cards
├── /articles
├── /tags
├── /authors
├── /faqs
├── /webpages
└── /seo/
    ├── /robots
    └── /sitemap
```

## Dashboard Menu Structure
The dashboard menu is defined in `AppSidebar.tsx` with the following structure:

```typescript
const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    path: "/admin",
    description: "Overview and statistics"
  },
  {
    title: "Credit Cards",
    icon: CreditCard,
    path: "/admin/credit-cards",
    description: "Manage credit card offerings"
  },
  {
    title: "Banks",
    icon: Building2,
    path: "/admin/banks",
    description: "Banking institutions"
  },
  {
    title: "Blog Articles",
    icon: FileText,
    path: "/admin/articles",
    description: "Content management"
  },
  {
    title: "Web Pages",
    icon: FileText,
    path: "/admin/webpages",
    description: "Static pages management"
  },
  {
    title: "Tags",
    icon: Tags,
    path: "/admin/tags",
    description: "Article categorization"
  },
  {
    title: "Authors",
    icon: Users,
    path: "/admin/authors",
    description: "Content creators"
  },
  {
    title: "FAQs",
    icon: HelpCircle,
    path: "/admin/faqs",
    description: "Manage frequently asked questions"
  },
  {
    title: "SEO",
    icon: Search,
    description: "Search Engine Optimization",
    submenu: [
      {
        title: "Robots.txt",
        icon: FileJson,
        path: "/admin/seo/robots",
        description: "Configure robots.txt"
      },
      {
        title: "Sitemap",
        icon: Settings2,
        path: "/admin/seo/sitemap",
        description: "Manage XML sitemap"
      }
    ]
  }
]
```

## Important Implementation Notes

### React Router Setup
The routing is configured in `App.tsx` using React Router's nested routes structure:

```typescript
<BrowserRouter>
  <Routes>
    <Route path="/auth/login" element={<Login />} />
    <Route path="/" element={<Home />} />
    <Route path="/admin/*" element={
      <AuthGuard>
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <AppSidebar />
            <main className="flex-1 p-6">
              <Routes>
                <Route index element={<Dashboard />} />
                <Route path="/banks" element={<Banks />} />
                <Route path="/credit-cards" element={<CreditCards />} />
                <Route path="/articles" element={<Articles />} />
                <Route path="/tags" element={<Tags />} />
                <Route path="/authors" element={<Authors />} />
                <Route path="/faqs" element={<FAQs />} />
                <Route path="/webpages" element={<Webpages />} />
                <Route path="/seo/robots" element={<Robots />} />
              </Routes>
            </main>
          </div>
        </SidebarProvider>
      </AuthGuard>
    } />
    <Route path="/:slug" element={<DynamicPage />} />
  </Routes>
</BrowserRouter>
```

### Adding New Routes
When adding new routes to the admin dashboard:

1. Create the component in the appropriate directory under `src/pages/admin/`
2. Add the route to the nested Routes in `App.tsx` under the `/admin/*` route
3. Add the menu item to `menuItems` in `AppSidebar.tsx`
4. Ensure the path in the menu item matches the route path exactly

### Authentication
All admin routes are protected by the `AuthGuard` component which:
- Checks for valid authentication
- Redirects to login if not authenticated
- Provides user context to child components

### Layout Structure
The admin dashboard uses a consistent layout with:
- Sidebar navigation (`AppSidebar`)
- Top bar with user profile and sidebar toggle
- Main content area with padding
- Toast notifications for feedback

### API Routes
API endpoints follow a similar structure to the frontend routes:
- `/api/admin/*` - Admin API endpoints
- Each endpoint should handle appropriate HTTP methods (GET, POST, etc.)
- All admin API endpoints should check for authentication

Remember to always keep this documentation updated when making changes to the routing structure or menu items.

## Project General Structure

```
recoverycashback/
├── src/
│   ├── components/
│   │   ├── articles/
│   │   ├── authors/
│   │   ├── banks/
│   │   ├── blog/
│   │   ├── cashback-rates/
│   │   ├── common/
│   │   ├── credit-cards/
│   │   └── ui/
│   ├── pages/
│   │   ├── auth/
│   │   └── [main pages]
│   ├── integrations/
│   └── App.tsx
└── public/
```

## Main Routes

The application uses React Router for route management. Here are the main routes:

- `/` - Home page
- `/login` - Login page
- `/dashboard` - Main dashboard
- `/banks` - Bank management
- `/credit-cards` - Credit card management
- `/articles` - Blog article management
- `/tags` - Tag management
- `/authors` - Author management
- `/faqs` - FAQ management
- `/webpages` - Dynamic webpage management

## Component Architecture

### Main Components

1. **AppSidebar**
   - Main navigation sidebar
   - Section navigation management

2. **AuthGuard**
   - Route protection
   - Authentication management

3. **ThemeToggle**
   - Light/dark theme switching

### Article Components

1. **ArticleDialog**
   - Modal for creating/editing articles
   - Content editor integration

2. **ContentEditor**
   - Rich editor for article content
   - Markdown support

3. **ImageUpload**
   - Featured image management
   - Image upload and processing

### Management Components

1. **BankDialog**
   - Banking information management

2. **CashbackRatesDialog**
   - Cashback rates configuration

3. **CardBenefitsDialog**
   - Card benefits management

## Backend Integration

### Supabase

The application uses Supabase as backend, providing:
- User authentication
- Real-time database
- File storage
- Automatic REST API

## State and Data Management

1. **React Query**
   - Server state management
   - Data caching and synchronization

2. **Contexts**
   - SidebarProvider: Sidebar state
   - ThemeProvider: Theme management

## UI Components

The application uses a custom UI component library including:
- Toaster: Notifications
- Tooltip: Hover information
- Button: Styled buttons
- Badge: Visual labels

## Security Features

1. **Authentication**
   - Session management with Supabase
   - Route protection with AuthGuard

2. **Authorization**
   - Role-based access control
   - Granular function permissions

## Content Management

1. **Articles**
   - Rich content editor
   - Tag system
   - Author management
   - Featured images

2. **Dynamic Pages**
   - Template system
   - Custom URLs
   - SEO meta information

## Optimizations

1. **Performance**
   - Component lazy loading
   - Query caching with React Query
   - Image optimization

2. **SEO**

To configure the articles or the page in SEO we have the following fields that indicate the SEO configuration patterns
Table: blog_articles
Fields: meta_title: string; meta_description: string; slug_url: string; meta_image: string;

   - Meta title

   - Meta description

   - Meta keywords

   - Meta image

   - Dynamic meta tags
   - SEO-friendly URLs
   - Structured data

# Supabase.com DB Estructure Proyect

| table_name     | column_name             | data_type                | is_nullable |
| -------------- | ----------------------- | ------------------------ | ----------- |
| authors        | id                      | uuid                     | NO          |
| cashback_rates | updated_at              | timestamp with time zone | NO          |
| card_benefits  | id                      | uuid                     | NO          |
| card_benefits  | card_id                 | uuid                     | YES         |
| card_benefits  | benefit_type            | USER-DEFINED             | NO          |
| card_benefits  | created_at              | timestamp with time zone | NO          |
| card_benefits  | updated_at              | timestamp with time zone | NO          |
| tags           | id                      | uuid                     | NO          |
| tags           | created_at              | timestamp with time zone | NO          |
| tags           | updated_at              | timestamp with time zone | NO          |
| article_tags   | article_id              | uuid                     | NO          |
| article_tags   | tag_id                  | uuid                     | NO          |
| card_requests  | id                      | uuid                     | NO          |
| card_requests  | user_id                 | uuid                     | YES         |
| card_requests  | card_id                 | uuid                     | YES         |
| card_requests  | status                  | USER-DEFINED             | YES         |
| card_requests  | created_at              | timestamp with time zone | NO          |
| card_requests  | updated_at              | timestamp with time zone | NO          |
| credit_cards   | id                      | uuid                     | NO          |
| credit_cards   | bank_id                 | uuid                     | YES         |
| credit_cards   | minimum_salary          | numeric                  | YES         |
| credit_cards   | monthly_retail_apr      | numeric                  | YES         |
| credit_cards   | cash_apr                | numeric                  | YES         |
| credit_cards   | late_fee                | numeric                  | YES         |
| credit_cards   | created_at              | timestamp with time zone | NO          |
| credit_cards   | updated_at              | timestamp with time zone | NO          |
| credit_cards   | is_promotion            | boolean                  | YES         |
| credit_cards   | cashback_card           | boolean                  | YES         |
| credit_cards   | webpage                 | uuid                     | YES         |
| seo_config     | id                      | bigint                   | NO          |
| authors        | created_at              | timestamp with time zone | NO          |
| authors        | updated_at              | timestamp with time zone | NO          |
| faqs           | id                      | uuid                     | NO          |
| faqs           | order_index             | integer                  | NO          |
| faqs           | is_published            | boolean                  | YES         |
| faqs           | created_at              | timestamp with time zone | NO          |
| faqs           | updated_at              | timestamp with time zone | NO          |
| webpages       | id                      | uuid                     | NO          |
| webpages       | is_published            | boolean                  | YES         |
| webpages       | created_at              | timestamp with time zone | NO          |
| webpages       | updated_at              | timestamp with time zone | NO          |
| webpages       | published_at            | timestamp with time zone | YES         |
| seo_config     | created_at              | timestamp with time zone | NO          |
| seo_config     | updated_at              | timestamp with time zone | NO          |
| profiles       | id                      | uuid                     | NO          |
| profiles       | role                    | USER-DEFINED             | YES         |
| profiles       | created_at              | timestamp with time zone | NO          |
| profiles       | updated_at              | timestamp with time zone | NO          |
| blog_articles  | id                      | uuid                     | NO          |
| blog_articles  | author                  | uuid                     | YES         |
| blog_articles  | is_published            | boolean                  | YES         |
| blog_articles  | created_at              | timestamp with time zone | NO          |
| blog_articles  | updated_at              | timestamp with time zone | NO          |
| blog_articles  | published_at            | timestamp with time zone | YES         |
| blog_articles  | schema_type             | USER-DEFINED             | YES         |
| banks          | id                      | uuid                     | NO          |
| banks          | created_at              | timestamp with time zone | NO          |
| banks          | updated_at              | timestamp with time zone | NO          |
| cashback_rates | id                      | uuid                     | NO          |
| cashback_rates | card_id                 | uuid                     | YES         |
| cashback_rates | supermarket_rate        | numeric                  | YES         |
| cashback_rates | international_rate      | numeric                  | YES         |
| cashback_rates | online_rate             | numeric                  | YES         |
| cashback_rates | other_rate              | numeric                  | YES         |
| cashback_rates | cinema_rate             | numeric                  | YES         |
| cashback_rates | dining_rate             | numeric                  | YES         |
| cashback_rates | government_rate         | numeric                  | YES         |
| cashback_rates | real_estate_rate        | numeric                  | YES         |
| cashback_rates | education_rate          | numeric                  | YES         |
| cashback_rates | fuel_rate               | numeric                  | YES         |
| cashback_rates | rental_rate             | numeric                  | YES         |
| cashback_rates | telecom_rate            | numeric                  | YES         |
| cashback_rates | insurance_rate          | numeric                  | YES         |
| cashback_rates | utility_rate            | numeric                  | YES         |
| cashback_rates | travel_rate             | numeric                  | YES         |
| cashback_rates | min_spend               | numeric                  | YES         |
| cashback_rates | max_cashback            | numeric                  | YES         |
| cashback_rates | created_at              | timestamp with time zone | NO          |
| seo_config     | robots_txt              | text                     | YES         |
| credit_cards   | joining_offer           | text                     | YES         |
| credit_cards   | annual_fee              | text                     | YES         |
| webpages       | meta_title              | text                     | NO          |
| profiles       | email                   | text                     | NO          |
| webpages       | meta_description        | text                     | NO          |
| cashback_rates | redemption_method       | text                     | YES         |
| cashback_rates | additional_info         | text                     | YES         |
| credit_cards   | cash_advance_fee        | text                     | YES         |
| blog_articles  | slug_url                | text                     | NO          |
| blog_articles  | meta_title              | text                     | NO          |
| blog_articles  | meta_description        | text                     | NO          |
| blog_articles  | document_text           | text                     | NO          |
| credit_cards   | foreign_transaction_fee | text                     | YES         |
| faqs           | question                | text                     | NO          |
| credit_cards   | overlimit_fee           | text                     | YES         |
| credit_cards   | minimum_due             | text                     | YES         |
| card_benefits  | description             | text                     | NO          |
| blog_articles  | featured_image          | text                     | YES         |
| credit_cards   | other_key_benefits      | text                     | YES         |
| blog_articles  | meta_keywords           | text                     | YES         |
| blog_articles  | meta_image              | text                     | YES         |
| credit_cards   | offers                  | text                     | YES         |
| banks          | name                    | text                     | NO          |
| credit_cards   | image_url               | text                     | YES         |
| tags           | name                    | text                     | NO          |
| faqs           | answer                  | text                     | NO          |
| webpages       | document_text           | text                     | NO          |
| webpages       | youtube_link            | text                     | YES         |
| webpages       | tiktok_link             | text                     | YES         |
| webpages       | instagram_link          | text                     | YES         |
| webpages       | reddit_link             | text                     | YES         |
| authors        | name                    | text                     | NO          |
| authors        | bio                     | text                     | YES         |
| card_requests  | notes                   | text                     | YES         |
| authors        | avatar_url              | text                     | YES         |
| authors        | twitter_url             | text                     | YES         |
| authors        | linkedin_url            | text                     | YES         |
| authors        | website_url             | text                     | YES         |
| credit_cards   | card_name               | text                     | NO          |
| webpages       | slug_url                | text                     | NO          |
