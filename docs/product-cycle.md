# EwiSSouq — Product Cycle

> Source of truth for business requirements, IA, and phased delivery.
> Last updated: 2026-07-14

## Vision

Social marketplace (RTL-first, ar/en/fr) with three listing types under one discovery experience:

| Type | User | Core action |
|------|------|-------------|
| `classified` | Individual / business | Browse → contact → deal |
| `auction` | Individual | Browse live → bid |
| `offer` | Verified store | Browse → claim → visit store |

**Principle:** one discovery hub + three publish intents — not three disconnected apps.

## Roles

- **Guest** — browse all; gated on publish / bid / claim / message / persistent save
- **Individual** — classified + auction publish, bid, message, follow
- **Store (verified)** — offer publish, store profile (offers / branches / about), offer inquiries

## Information Architecture

```
/                     Home discovery (mixed feed + type chips)
/marketplace          Classified browse
/marketplace/:id      Classified detail → profile or store
/auctions             Auctions list (+ live count in nav)
/auctions/:id         Auction detail → bid
/stores               Offers hub (all offers)
/offers/:id           Offer detail → claim → /stores/:slug
/stores/:slug         Store profile (offers | branches | about)
/search               Unified search (all types — P1 deep)
/create-listing       Publish chooser → form by type
/messages             Inbox MVP (listing-threaded)
/profile/:id          Individual seller
/saved                Saved items
/notifications        Typed deep-links
/auth/login|register|forgot-password
```

### Canonical flows

1. **Register** → choose Individual | Store → login context preserved (`redirect`)
2. **Home chip** → mixed or filtered feed → detail by `listingType`
3. **Offer detail** → Claim (auth) → success → Store profile
4. **Classified detail** → Contact (auth) → `/messages?listingId=&sellerId=`
5. **Auction detail** → Bid (auth)
6. **Sell** → type sheet → classified | auction | offer (store only)

## Timeline (Home) — simple card system

- Max **2 columns** desktop / 1 mobile
- Equal visual weight (no dense irregular bento)
- Card: media + type badge + title + price/bid/discount + seller line
- Like/Save on hover or subtle footer (desktop)
- Chips: All | Classifieds | Auctions | Offers
- Sidebar: ads + ending-soon offers + live auctions + categories (no duplicate trending/most-viewed blocks)

## Auth rules

- Middleware stores `redirect` = intended full path
- Login / register return to `redirect` or `/`
- Actions using `useRequireAuth()` push login with return URL when logged out

## Pages change log

| Action | Page |
|--------|------|
| Keep / clarify | `/stores` = offers hub |
| Simplify | Home feed grid + FeedPost |
| Add | Account type on register; publish type on create-listing |
| Add | `/messages` MVP |
| Wire | Contact seller, claim offer |
| Restore | Home sidebar discovery (offers + live auctions) |

## Phases

### P0 — This cycle
- [x] `docs/product-cycle.md`
- [x] Simplified 2-col timeline + listing type chips
- [x] Mixed feed (classified + auction + offer)
- [x] Auth `redirect` + require-auth helper
- [x] Register Individual | Store
- [x] Publish type chooser
- [x] Contact → messages MVP; Claim with auth + success
- [x] Home sidebar: live auctions + ending offers

### P1
- Unified `/search` across types
- Full chat threads + notifications wiring
- Offer create form (store dashboard)
- Bottom mobile nav

### P2
- SEO / meta, a11y pass, advanced filters, premium cards, video editor

## Acceptance (P0)

1. New user sees type badges and understands offer vs auction vs ad on Home
2. Card → detail → seller/store → back within two hops
3. Login does not drop the intended page (`redirect`)
4. Store signup creates business-linked account (mock)
5. Bid / claim / contact gated; claim and contact complete a visible path
6. Timeline quieter than prior bento
