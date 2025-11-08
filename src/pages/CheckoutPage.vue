<template>
  <q-page class="q-pa-md">
    <div class="container">
      <h2>Checkout</h2>

      <div v-if="!isLoggedIn">
        <GoogleLoginButton />
      </div>
      <q-form v-if="itemsCount!='0'" @submit.prevent="submitOrder" @validation-error="onValidationError">
      <div class="float-left">
      <!-- Personal Info -->
      <q-card class="q-mb-md">
        <q-card-section>
          <div class="text-h6">Personal Details</div>
          <q-input @blur="handleInputBlur('first_name')" v-model="form.first_name" label="First Name" filled class="q-mb-sm" :rules="[val => !!val || 'First Name is required']"/>
          <q-input @blur="handleInputBlur('last_name')" v-model="form.last_name" label="Last Name" filled class="q-mb-sm" :rules="[val => !!val || 'Last Name is required']"/>
          <q-input
              @blur="handleInputBlur('email')" v-model="form.email"
              label="Email" filled class="q-mb-sm"
              type="text"
              :rules="[
                  val => !!val || 'Email is required',
    val => /^\S+@\S+\.\S+$/.test(val) || 'Please enter a valid email'
  ]"
          />
          <q-input @blur="handleInputBlur('phone')" v-model="form.phone" label="Phone" filled :rules="[val => !!val || 'Phone is required']"/>
        </q-card-section>
      </q-card>

      <!-- Shipping Address -->
      <q-card class="q-mb-md">
        <q-card-section>
          <div class="text-h6">Shipping Address</div>
          <q-input @blur="handleInputBlur('postcode')" v-model="form.shipping.address_1" label="Address" filled class="q-mb-sm" :rules="[val => !!val || 'Address is required']"/>
          <q-input @blur="handleInputBlur('postcode')" v-model="form.shipping.city" label="City" filled class="q-mb-sm" :rules="[val => !!val || 'City is required']"/>
          <q-input @blur="handleInputBlur('postcode')" v-model="form.shipping.postcode" label="Postcode" filled class="q-mb-sm" :rules="[val => !!val || 'Postcode is required']"/>
          <q-input readonly @blur="handleInputBlur('postcode')" v-model="form.shipping.country" label="Country" filled />
        </q-card-section>

        <q-card-section>
          <q-checkbox v-model="billingSameAsShipping" label="Different billing address?" />
        </q-card-section>
      </q-card>

      <!-- Billing Address (conditional) -->
      <q-card v-if="!billingSameAsShipping" class="q-mb-md">
        <q-card-section>
          <div class="text-h6">Billing Address</div>
          <q-input @blur="handleInputBlur('postcode')" v-model="form.billing.address_1" label="Billing Address" filled class="q-mb-sm" />
          <q-input @blur="handleInputBlur('postcode')" v-model="form.billing.city" label="City" filled class="q-mb-sm" />
          <q-input @blur="handleInputBlur('postcode')" v-model="form.billing.postcode" label="Postcode" filled class="q-mb-sm" />
          <q-input @blur="handleInputBlur('postcode')" v-model="form.billing.country" label="Country" filled />
        </q-card-section>
      </q-card>

      <!-- Coupon Section -->
      <q-card class="q-mb-md">
        <q-card-section>
          <div class="text-h6">Coupon</div>
          <div class="row items-center q-col-gutter-md">
            <div class="col">
              <q-input v-model="couponCode" label="Coupon code" filled />
            </div>
            <div class="col-auto">
              <q-btn label="Apply" color="primary" @click="applyCoupon" />
              <q-btn
  v-if="couponApplied"
  label="Remove Coupon"
  color="negative"
  @click="removeCoupon"
/>
            </div>
          </div>
          <div v-if="couponApplied" class="text-positive q-mt-sm">
            Coupon applied successfully!
          </div>
          <div v-if="couponError" class="text-negative q-mt-sm">
            {{ couponError }}
          </div>

          <div v-if="cart.state.coupons.length">
  <div v-for="coupon in cart.state.coupons" :key="coupon.code" class="q-mb-sm row items-center">
    <q-chip color="primary" text-color="white" class="q-mr-sm">
      {{ coupon.code }}
    </q-chip>
    <q-btn flat color="negative" label="Remove" @click="removeCoupon(coupon.code)" />
  </div>
</div>

        </q-card-section>
      </q-card>

      </div>
      <div class="float-right">
      <!-- Cart Items -->
      <q-card class="q-mb-md">
        <q-card-section>
          <div class="text-h6">Your Cart</div>
          <div v-for="item in cartItems" :key="item.key" class="q-my-sm flex items-center">
          <div>
             <q-img
              v-if="item.images.length"
              :src="item.images[0].src"
              :alt="item.name"
              height="100px"
              width="100px"
              class="rounded-borders"
            />
            </div>
            <div class="flex">
            <div class="item-name">
      <router-link
  :to="`/product/${getSlugFromPermalink(item.permalink)}`"
  class="no-decoration">
              {{ item.name }}</router-link>
             <div v-if="item.variation && item.variation.length > 0">
             <div
             v-for="(variation, index) in item.variation"
             :key="index"
             >
             {{variation.attribute}}: {{variation.value}}
             </div>
          </div>
         </div>
              × {{ item.quantity }} - {{ formatCurrency(item.totals?.line_total, {minorUnit: item.totals?.currency_minor_unit, decimalSeparator: item.totals?.currency_decimal_separator, prefix: item.totals?.currency_prefix, suffix: item.totals?.currency_suffix}) }}
            </div>
          </div>
        </q-card-section>
      </q-card>

    <!-- Shipping Method -->
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">Choose Shipping Method</div>
        <q-option-group
          v-model="selectedShippingRateId"
          :options="shippingOptions"
          type="radio"
          @update:model-value="onShippingMethodChange"
        />
      </q-card-section>
    </q-card>


      <!-- Payment -->
      <q-card class="q-mb-md">
        <q-card-section>
          <div class="text-h6">Payment Method</div>
          <q-option-group
            v-model="paymentMethod"
            :options="paymentMethods"
            type="radio"
          />
        </q-card-section>
      </q-card>

      <!-- Total & Place Order -->
      <q-card class="q-mb-md">
        <q-card-section>
          <div class="text-h6">Total: {{ cartTotal }}</div>
        </q-card-section>
        <q-card-actions>
          <q-btn label="Place Order" type="submit" color="primary" />
        </q-card-actions>
      </q-card>
        </div>
    </q-form>
      <div v-else-if="itemsCount === 0">
        Your cart is empty!
        <router-link to="/products/">Go to shop</router-link>
      </div>

      <!-- Render loader and sync retry state -->
      <div v-if="cart.state.loading.cart" class="centered">
        <q-spinner color="primary" size="2em" />
        <div>Synchronizing cart, please wait...</div>
      </div>
      <div v-if="syncError" class="text-negative q-mt-md text-center">
        {{ syncError }}
        <q-btn label="Retry Sync" color="primary" @click="syncCart" class="q-ml-md" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue';
import cart from 'src/stores/cart';
import { useRouter } from 'vue-router';
import { fetchWithToken } from 'src/composables/useApiFetch.js';
import GoogleLoginButton from 'src/components/GoogleLoginButton.vue';

const syncError = ref(null);

const token = ref('');

if(process.env.Client) {
  token.value = localStorage.getItem('jwt_token');
}

const isLoggedIn = ref(!!token.value)

const router = useRouter();

const form = reactive({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  shipping: {
    address_1: '',
    city: '',
    postcode: '',
    country: 'IL',
  },
  billing: {
    address_1: '',
    city: '',
    postcode: '',
    country: 'IL',
  }
});

const billingSameAsShipping = ref(true)

//const useDifferentBilling = ref(false);
const couponCode = ref('');
const couponApplied = ref(false);
const itemsCount = ref("0");
const couponError = ref(null);
//const deliveryMethod = ref('pickup');
const paymentMethod = ref('bacs');
const paymentMethods = ref([]);
const selectedShippingRateId = ref(null);
const shippingOptions = ref([]);

const cartItems = computed(() => cart.state.cart_array.items);
const cartTotal = computed(() => {
  const total = cart.state.totals?.total_price || '0';
  const formattedTotal = formatCurrency(total, {minorUnit: 2, decimalSeparator: '.', prefix: '₪', suffix: ''});

  return formattedTotal;
});

// More reliable slug extractor using regex
const getSlugFromPermalink = (permalink) => {
  if(permalink) {
    const match = permalink.match(/product\/([^/]+)\/?$/)
    return match ? match[1] : ''
  }
  return '';
}

/*async function applyCoupon() {
  couponApplied.value = false;
  couponError.value = null;
  try {
    const res = await fetchWithToken('https://nuxt.meidanm.com/wp-json/wc/store/cart/apply-coupon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ code: couponCode.value })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Invalid coupon');

    couponApplied.value = true;
    await cart.fetchCart();
  } catch (err) {
    couponError.value = err.message;
  }
}*/

const initializeFormFromCart = async () => {
  await cart.fetchCart(); // Make sure cart is up to date

  cart.state.cart_array.payment_methods.forEach((method) => {
    let label = '';
    if (method == 'bacs') {
      label = 'Bank transfer';
    } else {
      label = method;
    }

    paymentMethods.value.push({label: label, value: method});
  })
  itemsCount.value = cart.state.cart_array.items_count;
  const billing = cart.state.cart_array.billing_address || {};
  const shipping = cart.state.cart_array.shipping_address || {};

  form.first_name = shipping.first_name || '';
  form.last_name = shipping.last_name || '';
  form.email = billing.email || '';
  form.phone = billing.phone || '';

  form.shipping.address_1 = shipping.address_1 || '';
  form.shipping.city = shipping.city || '';
  form.shipping.postcode = shipping.postcode || '';
  form.shipping.country = shipping.country || 'IL';

  form.billing.address_1 = billing.address_1 || '';
  form.billing.city = billing.city || '';
  form.billing.postcode = billing.postcode || '';
  form.billing.country = billing.country || 'IL';
};

const updateShippingAddress = async () => {
  try {
    const response = await fetchWithToken('https://nuxt.meidanm.com/wp-json/wc/store/v1/cart/update-customer', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include',
      body: JSON.stringify({
        billing_address: {
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          phone: form.phone,
          address_1: billingSameAsShipping.value ? form.shipping.address_1 : form.billing.address_1,
          city: billingSameAsShipping.value ? form.shipping.city : form.billing.city,
          postcode: billingSameAsShipping.value ? form.shipping.postcode : form.billing.postcode,
          country: billingSameAsShipping.value ? form.shipping.country : form.billing.country,
        },
        shipping_address: {
          first_name: form.first_name,
          last_name: form.last_name,
          address_1: form.shipping.address_1,
          city: form.shipping.city,
          postcode: form.shipping.postcode,
          country: form.shipping.country,
          phone: form.phone,
          email: form.email,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update shipping address');
    }

    const updatedCart = await response.json();
    //cart.fetchCart();
    console.log('Cart updated', updatedCart);
    // Optionally update local cart state or refresh shipping rates
  } catch (error) {
    console.error('Error updating shipping address:', error.message);
  }
};

const handleInputBlur = (field) => {
  const value = form.shipping[field] ? form.shipping[field] : form[field];
  if (value && value.length > 1) {
    updateShippingAddress();
    fetchShippingRates();
  }
};

function formatCurrency(amountStr, {
  minorUnit = 2,
  decimalSeparator = '.',
  prefix = '$',
  suffix = ''
} = {}) {
  const amount = parseInt(amountStr, 10);

  if (isNaN(amount)) return `${prefix}0${decimalSeparator}${'0'.repeat(minorUnit)}${suffix}`;

  const factor = Math.pow(10, minorUnit);
  const number = amount / factor;

  return `${number.toLocaleString(undefined, {
    minimumFractionDigits: minorUnit,
    maximumFractionDigits: minorUnit
  })}${suffix}${prefix}`;
}

const applyCoupon = () => cart.applyCoupon(couponCode.value);
const removeCoupon = () => cart.removeCoupon(couponCode.value);
// Fetch shipping methods
const fetchShippingRates = async () => {

  const data = await cart.fetchCart();
  console.log(data);
  console.log(cart.state.cart_array);
  if (cart.state.cart_array.shipping_rates && cart.state.cart_array.shipping_rates[0]) {
    shippingOptions.value = cart.state.cart_array.shipping_rates[0].shipping_rates.map(rate => ({
      label: `${rate.name} – ${formatCurrency(rate.price, {
        minorUnit: 2,
        decimalSeparator: '.',
        prefix: '₪',
        suffix: ''
      })}`,
      value: rate.rate_id,
    }));
  }
  if (shippingOptions.value.length > 0) {
    selectedShippingRateId.value = shippingOptions.value[0].value;
  }
};

const onShippingMethodChange = async (newRateId) => {
  try {
    // Send selected shipping rate to WooCommerce
    await fetchWithToken('https://nuxt.meidanm.com/wp-json/wc/store/cart/select-shipping-rate', {
      method: 'POST',
      headers: {'Content-Type': 'application/json', Authorization: `Bearer ${token.value}`},
      credentials: 'include',
      body: JSON.stringify({package_id: 0, rate_id: newRateId})
    });

    // Re-fetch cart to get updated totals
    await cart.fetchCart();
    console.log(cart);
  } catch (error) {
    console.error('Error updating shipping method:', error);
  }
};

const onValidationError = async(ref) => {
  const valid = await ref.validate()

  if (!valid) {
    // Wait a tick for Quasar to focus the first invalid field
    requestAnimationFrame(() => {
      const el = document.activeElement
      if (el && typeof el.scrollIntoView === 'function') {
        el.scrollIntoView({behavior: 'smooth', block: 'center'})
      }
    })
    return
  }

}
const submitOrder = async () => {
  // Only place order after sync
  if (!cart.state.synced) {
    await syncCart();
    if (syncError.value) {
      return; // Don't submit if sync failed
    }
  }
  try {
    const payload = {
      billing_address: {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone: form.phone,
        address_1: billingSameAsShipping.value ? form.shipping.address_1 : form.billing.address_1,
        city: billingSameAsShipping.value ? form.shipping.city : form.billing.city,
        postcode: billingSameAsShipping.value ? form.shipping.postcode : form.billing.postcode,
        country: billingSameAsShipping.value ? form.shipping.country : form.billing.country,
      },
      shipping_address: {
        first_name: form.first_name,
        last_name: form.last_name,
        address_1: form.shipping.address_1,
        city: form.shipping.city,
        postcode: form.shipping.postcode,
        country: form.shipping.country,
        phone: form.phone,
        email: form.email,
      },
      payment_method: paymentMethod.value,
      payment_data: {},
      extensions: {},
      billing_same_as_shipping: billingSameAsShipping.value
    };

    console.log(paymentMethod.value);

    console.log(payload);
    console.log(form);
    const response = await cart.placeOrder(payload)
    console.log('Order placed:', response)

    router.push({
      name: 'thank-you',
      query: {orderId: response.order_id, billing_email: response.billing_address.email, order_key: response.order_key}
    });

    // Optional: clear cart, redirect to thank-you page, etc.
    await cart.fetchCart(); // Refresh cart in the store

  } catch (err) {
    console.error('Checkout error:', err.message)
  }
}

const syncCart = async () => {
  syncError.value = null;
  cart.state.loading.cart = true;
  try {
    await cart.syncLocalCartWithServer();
  } catch (err) {
    console.log(err);
    syncError.value = cart.state.error || 'Failed to sync cart';
  } finally {
    cart.state.loading.cart = false;
  }
}

onMounted(async () => {
  if (!cart.state.synced) {
    await syncCart();
    if (syncError.value) return; // Block further init if cart couldn't sync
  }
  initializeFormFromCart();
  fetchShippingRates();
  updateShippingAddress();
});

</script>

<style scoped>
.q-form .float-left {
  width: 57%;
}
.q-form .float-right {
  width: 41%;
}
</style>
