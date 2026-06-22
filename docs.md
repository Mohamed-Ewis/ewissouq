
Tech Stack:

* Nuxt 3
* Vue 3 Composition API
* JavaScript (NO TypeScript)
* Pinia
* Bootstrap 5 (NO Tailwind CSS)
* Axios
* VueUse
*vite
* SCSS
* Responsive Design

Project Type:

A modern Social Marketplace inspired by:

* Dubizzle
* OLX
* Facebook Marketplace
* TikTok Shop

Main Features:

1. Social Feed

Homepage should work as a social timeline.

Display:

* Product posts
* Product videos
* Trending products
* Recommended products
* Most viewed products
* Categories section
* Stories section
*timeLine

Support infinite scrolling.

2. Marketplace

Support:

* New products
* Used products

Each product contains:

* Images
* Short video up to 60 seconds
* Price
* Location
* Category
* Seller information
* Product condition
* Views count
* Likes count

3. Auctions Module

Dedicated auctions section.

Features:

* Active auctions
* Countdown timer
* Highest bid
* Number of bidders
* Auction details page
* Place bid UI

4. User Profiles

Profile contains:

* Avatar
* Cover photo
* Bio
* Followers
* Following
* Published products
* Sold products
* Saved products
* Ratings
* Activity feed

5. Social Features

* Follow users
* Like products
* Save products
* Comments
* Share products
* Notifications
* Activity feed
* Verification badge

6. Authentication UI

Login Page:

* Email
* Password
* Remember me
* Google Login UI
* Facebook Login UI
* Forgot Password

Register Page:

* Name
* Email
* Password
* Confirm Password
* Avatar upload

7. Create Listing Page

Allow:

* Multiple image upload
* Product video upload (max 60 sec)
* Title
* Description
* Category
* Price
* Product status
* Location

8. Search & Filters

Build a Dubizzle-like filter system.

Filters:

* Category
* Country
* City
* Area
* Price range
* New / Used
* Most recent
* Most viewed
* Highest rated
* Verified sellers
* Has video
* Sort options

9. Theme

Provide:

* Light mode
* Dark mode

Design should look modern and premium.

Use:

* Bootstrap 5 Components
* Bootstrap Icons
* SCSS Modules
* Animations
* Skeleton Loading
* Empty States
* Error States

---

## PROJECT ARCHITECTURE

Use the following folder structure:

src/

├── api/
│   ├── auth.js
│   ├── users.js
│   ├── products.js
│   ├── auctions.js
│   ├── categories.js
│   └── notifications.js
│
├── utils/
│   ├── request.js
│   ├── auth.js
│   └── constants.js
│
├── stores/
│   ├── auth.js
│   ├── products.js
│   ├── auctions.js
│   └── notifications.js
│
├── composables/
│
├── services/
│
├── pages/
│
├── components/
│
├── layouts/
│
├── middleware/
│
├── assets/
│
└── plugins/

---

## AXIOS ARCHITECTURE

Create a centralized Axios instance.

File:

utils/request.js

Requirements:

* Axios create()
* Base URL from environment variable
* Request interceptor
* Response interceptor
* JWT Authorization header
* Token refresh flow
* Handle 401 responses
* Queue pending requests during token refresh
* Global error handling

Architecture should be similar to enterprise Vue applications.

Example usage:

api/products.js

import request from "@/utils/request";

export function getProducts(params) {
return request({
url: "/products",
method: "get",
params
});
}

export function createProduct(data) {
return request({
url: "/products",
method: "post",
data
});
}

All API calls must go through request.js.

---

## DATA SOURCE

Use Mock Data Only.

Create realistic fake data for:

* Users
* Products
* Auctions
* Categories
* Notifications
* Comments

No Backend implementation.

---

## DELIVERABLE

Generate:

* Complete Nuxt 3 frontend
* Reusable Bootstrap components
* API layer
* Axios interceptors
* Stores
* Pages
* Layouts
* Mock services
* Clean architecture
* Production-ready structure
* Scalable codebase