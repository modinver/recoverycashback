# Recovery Cashback - Architecture and Structure

To start the app/web, I would suggest first creating a basic home page with a link to the backoffice, which will be the first part we develop. Once we have the backoffice, we will move on to building the home page and other URLs for the project.
Additionally, I want to create the backoffice for the administrator to manage the application’s data. The backoffice should allow the admin to perform a CRUD (Create, Read, Update, Delete) on the general data of the application. Once all the credit cards and their data are added to the system, I will proceed to build the FrontPage to properly present everything.
The backoffice needs to have all the necessary icons and functionalities to manage:
Credit card data (from the credit cards table).
Blog articles (from the blog table).
User management (administering user accounts, roles, and permissions).
The focus should be on perfecting the backoffice first before moving to the front-end implementation.




The project you are developing is a cashback credit card comparison application, not a construction budgeting application. Apologies for the confusion.
Below, I provide the ideal features for your cashback credit card comparison app in Next.js:
1. Project Structure and Functionality
Credit Card Comparison: Users should be able to compare different credit cards offering cashback. The app should display cashback rates, additional benefits, annual fees, etc.
Filter and Sort: Users should be able to filter cards by various criteria (e.g., cashback percentage, annual fee, additional benefits, salary requirements).
Card Detail: Each card should have a details page that includes all relevant information, such as cashback rate, fees, benefits, welcome offers, etc.
2. Performance and SEO
Static Site Generation (SSG): Use SSG for static pages containing credit card information. This will enhance performance as the pages are pre-generated during the site build.
SEO Optimized: Each card and page should be optimized for SEO with titles, descriptions, and friendly URLs, using next/head to manage metadata tags.
Fast Loading: Implement lazy loading for images and heavy resources to ensure low load times and a smooth user experience.
3. API and Database Interaction
API Routes in Next.js: Use Next.js API Routes to handle backend logic, such as fetching credit card data and comparing them.
Relational Database: Use a database like SuperBase to store credit card information, including details such as bank name, cashback rate, annual fee, and other benefits.
Cashback Calculation: The app should be capable of performing real-time calculations of the potential cashback a user could earn based on their purchases.
4. User Interface
Clean and Easy-to-Use Interface: The app should have an intuitive interface allowing users to quickly compare cards. Use components like comparison tables, interactive cards for each product, and a filter system to make searching easier.
Responsive Design: Ensure the app is fully responsive for a smooth experience on both mobile and desktop devices.
Payment and Registration Compatibility: If users can sign up or make payments, ensure you have secure forms and payment processes, using technologies like Stripe or PayPal for transactions.
5. User Authentication (if necessary)
NextAuth.js: Implement NextAuth.js to manage user authentication if you plan to allow registration or login.
JWT for Secure Sessions: If the app needs to handle sessions or store personalized user information, implement a JWT-based authentication system.
6. Integration with External Services
Bank or Financial Services APIs: If possible, integrate bank or financial services APIs to retrieve up-to-date credit card cashback data and features.
Real-Time Offers and Promotions: If the app offers information on special offers or promotions, ensure you integrate external sources to keep the data updated in real-time.
7. User Feedback and Analytics
Rating and Review System: Allow users to rate cards and leave comments. This will provide user-generated content that may be valuable to others.
Usage Statistics: Optionally, include an analytics panel to monitor user behavior and which cards are the most viewed or highly rated.
8. Notifications and Alerts
Cashback Alerts: Notify users when new promotions or significant changes occur with cards that may affect their purchasing decisions.
Payment Reminders: If relevant to your app, you can add a reminder system so users don’t miss payment deadlines.
9. Security
Data Encryption: Ensure that the app protects sensitive user information using security protocols like HTTPS and data encryption.
Protection Against Attacks: Implement security measures such as protection against CSRF, XSS, and SQL Injection.
With these features, you will be able to create an efficient, fast, secure, and easy-to-use cashback credit card comparison application while ensuring that it is optimized for both SEO and a high-quality user experience.

# SEO optimize

To configure the articles or the page in SEO we have the following fields that indicate the SEO configuration patterns

Table: blog_articles
Fields: meta_title; meta_description; slug_url; meta_image: string; meta_keyword, meta_image

   - Meta title

   - Meta description

   - Meta keywords

   - Meta image


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
