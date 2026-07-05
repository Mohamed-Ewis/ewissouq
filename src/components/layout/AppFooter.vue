<template>
  <footer class="app-footer mt-auto py-4">
    <div class="container-fluid px-4">
      <div class="row g-4">
        <div class="col-md-4">
          <h6 class="fw-bold mb-3">
            <span class="text-gradient">EwiSSouq</span>
          </h6>
          <p class="text-muted small">
            {{ $t('footer.tagline') }}
          </p>
        </div>
        <div class="col-6 col-md-2">
          <h6 class="fw-semibold mb-3 small text-uppercase">{{ $t('footer.marketplace') }}</h6>
          <ul class="list-unstyled small">
            <li><NuxtLinkLocale to="/marketplace">{{ $t('footer.browse') }}</NuxtLinkLocale></li>
            <li><NuxtLinkLocale to="/stores">{{ $t('nav.stores') }}</NuxtLinkLocale></li>
            <li><NuxtLinkLocale to="/auctions">{{ $t('footer.auctions') }}</NuxtLinkLocale></li>
            <li><NuxtLinkLocale to="/create-listing">{{ $t('footer.sellItem') }}</NuxtLinkLocale></li>
          </ul>
        </div>
        <div class="col-6 col-md-2">
          <h6 class="fw-semibold mb-3 small text-uppercase">{{ $t('footer.account') }}</h6>
          <ul class="list-unstyled small">
            <li><NuxtLinkLocale to="/auth/login">{{ $t('footer.login') }}</NuxtLinkLocale></li>
            <li><NuxtLinkLocale to="/auth/register">{{ $t('footer.register') }}</NuxtLinkLocale></li>
            <li><NuxtLinkLocale to="/saved">{{ $t('footer.savedItems') }}</NuxtLinkLocale></li>
          </ul>
        </div>
        <div class="col-md-4">
          <h6 class="fw-semibold mb-3 small text-uppercase">{{ $t('footer.connect') }}</h6>
          <div class="d-flex gap-2">
            <a href="#" class="social-link"><i class="bi bi-facebook" /></a>
            <a href="#" class="social-link"><i class="bi bi-instagram" /></a>
            <a href="#" class="social-link"><i class="bi bi-twitter-x" /></a>
            <a href="#" class="social-link"><i class="bi bi-tiktok" /></a>
          </div>
        </div>
      </div>
      <hr class="my-4" />
      <p class="text-center text-muted small mb-0">
        {{ $t('footer.copyright', { year }) }}
      </p>
    </div>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>

<style scoped lang="scss">
.app-footer {
  background: var(--es-surface);
  border-top: 1px solid var(--es-border);

  a {
    color: var(--es-text-muted);
    text-decoration: none;
    &:hover { color: var(--es-primary); }
  }
}

.social-link {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--es-surface-2);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all $transition;

  &:hover {
    background: var(--es-primary);
    color: #fff !important;
  }
}
</style>
