# PostgreSQL Schema Analysis

This document outlines the database schema, including table structures, foreign keys, indexes, triggers, and functions.

## Functions

### `update_updated_at_column()`

- **Description:** A trigger function that updates the `updated_at` column of a table to the current timestamp (`NOW()`).
- **Returns:** `trigger`

---

## Table Structures

### `users`

Represents the users of the application.

**Columns**

| Name            | Type                       | Constraints               | Default                   |
| --------------- | -------------------------- | ------------------------- | ------------------------- |
| `id`            | `bigint`                   | `NOT NULL`, `PRIMARY KEY` | `nextval('users_id_seq')` |
| `uuid`          | `uuid`                     | `NOT NULL`, `UNIQUE`      |                           |
| `email`         | `varchar(255)`             | `UNIQUE`                  |                           |
| `password_hash` | `varchar(255)`             |                           |                           |
| `name`          | `varchar(100)`             |                           |                           |
| `created_at`    | `timestamp with time zone` |                           | `CURRENT_TIMESTAMP`       |
| `updated_at`    | `timestamp with time zone` |                           | `CURRENT_TIMESTAMP`       |
| `mobilephone`   | `text`                     | `NOT NULL`, `UNIQUE`      | `''::text`                |

**Triggers**

- `set_users_updated_at`: Before `UPDATE`, executes `update_updated_at_column()` to automatically update the `updated_at` timestamp.

---

### `auth_providers`

Stores third-party authentication provider information for users.

**Columns**

| Name               | Type                       | Constraints               | Default                            |
| ------------------ | -------------------------- | ------------------------- | ---------------------------------- |
| `id`               | `bigint`                   | `NOT NULL`, `PRIMARY KEY` | `nextval('auth_providers_id_seq')` |
| `user_id`          | `bigint`                   | `NOT NULL`                |                                    |
| `provider`         | `varchar(50)`              | `NOT NULL`                |                                    |
| `provider_user_id` | `varchar(255)`             | `NOT NULL`                |                                    |
| `created_at`       | `timestamp with time zone` |                           | `CURRENT_TIMESTAMP`                |

**Constraints**

- `uq_provider_user`: `UNIQUE` on (`provider`, `provider_user_id`).

**Foreign Keys**

- `auth_providers_user_id_fkey`: `user_id` references `users(id)` on `DELETE CASCADE`.

---

### `categories`

Stores main product categories.

**Columns**

| Name   | Type          | Constraints               | Default                        |
| ------ | ------------- | ------------------------- | ------------------------------ |
| `id`   | `integer`     | `NOT NULL`, `PRIMARY KEY` | `nextval('categories_id_seq')` |
| `name` | `varchar(50)` | `NOT NULL`, `UNIQUE`      |                                |

---

### `sub_categories`

Stores product sub-categories, linked to a main category.

**Columns**

| Name          | Type          | Constraints               | Default                            |
| ------------- | ------------- | ------------------------- | ---------------------------------- |
| `id`          | `integer`     | `NOT NULL`, `PRIMARY KEY` | `nextval('sub_categories_id_seq')` |
| `name`        | `varchar(50)` | `NOT NULL`                |                                    |
| `category_id` | `integer`     | `NOT NULL`                |                                    |

**Constraints**

- `sub_categories_name_category_id_key`: `UNIQUE` on (`name`, `category_id`).

**Foreign Keys**

- `sub_categories_category_id_fkey`: `category_id` references `categories(id)` on `DELETE CASCADE`.

---

### `products`

Stores product information.

**Columns**

| Name              | Type                       | Constraints                      | Default                      |
| ----------------- | -------------------------- | -------------------------------- | ---------------------------- |
| `id`              | `integer`                  | `NOT NULL`, `PRIMARY KEY`        | `nextval('products_id_seq')` |
| `name`            | `varchar(100)`             | `NOT NULL`                       |                              |
| `price`           | `numeric(10,2)`            | `NOT NULL`, `CHECK (price >= 0)` |                              |
| `description`     | `text`                     |                                  |                              |
| `stock`           | `integer`                  | `NOT NULL`, `CHECK (stock >= 0)` |                              |
| `image_url`       | `varchar(255)`             |                                  |                              |
| `category_id`     | `integer`                  | `NOT NULL`                       |                              |
| `sub_category_id` | `integer`                  | `NOT NULL`                       |                              |
| `created_at`      | `timestamp with time zone` |                                  | `CURRENT_TIMESTAMP`          |
| `updated_at`      | `timestamp with time zone` |                                  | `CURRENT_TIMESTAMP`          |
| `is_published`    | `boolean`                  | `NOT NULL`                       | `false`                      |
| `publish_at`      | `timestamp with time zone` |                                  |                              |
| `unpublish_at`    | `timestamp with time zone` |                                  |                              |
| `is_deleted`      | `boolean`                  | `NOT NULL`                       | `false`                      |

**Foreign Keys**

- `products_category_id_fkey`: `category_id` references `categories(id)` on `DELETE RESTRICT`.
- `products_sub_category_id_fkey`: `sub_category_id` references `sub_categories(id)` on `DELETE RESTRICT`.

**Indexes**

- `idx_products_category_id`: B-tree on `category_id`.
- `idx_products_name`: B-tree on `name`.
- `idx_products_sub_category_id`: B-tree on `sub_category_id`.

---

### `product_specs`

Stores different specifications for products (e.g., size, color).

**Columns**

| Name          | Type                       | Constraints               | Default                           |
| ------------- | -------------------------- | ------------------------- | --------------------------------- |
| `id`          | `integer`                  | `NOT NULL`, `PRIMARY KEY` | `nextval('product_specs_id_seq')` |
| `product_id`  | `integer`                  |                           |                                   |
| `spec_name`   | `text`                     | `NOT NULL`                |                                   |
| `spec_value`  | `text`                     | `NOT NULL`                |                                   |
| `extra_price` | `numeric(10,2)`            |                           | `0.00`                            |
| `stock`       | `integer`                  | `CHECK (stock >= 0)`      | `0`                               |
| `created_at`  | `timestamp with time zone` |                           | `now()`                           |
| `updated_at`  | `timestamp with time zone` |                           | `now()`                           |

**Foreign Keys**

- `product_specs_product_id_fkey`: `product_id` references `products(id)` on `DELETE CASCADE`.

**Triggers**

- `set_product_specs_updated_at`: Before `UPDATE`, executes `update_updated_at_column()`.

---

### `product_status_history`

Logs the status changes of a product.

**Columns**

| Name          | Type                       | Constraints               | Default                                    |
| ------------- | -------------------------- | ------------------------- | ------------------------------------------ |
| `id`          | `integer`                  | `NOT NULL`, `PRIMARY KEY` | `nextval('product_status_history_id_seq')` |
| `product_id`  | `integer`                  | `NOT NULL`                |                                            |
| `status`      | `text`                     | `NOT NULL`                |                                            |
| `reason`      | `text`                     |                           |                                            |
| `operated_by` | `text`                     |                           |                                            |
| `operated_at` | `timestamp with time zone` |                           | `now()`                                    |

**Foreign Keys**

- `product_status_history_product_id_fkey`: `product_id` references `products(id)`.

---

### `cart_items`

Stores items in a user's shopping cart.

**Columns**

| Name         | Type                       | Constraints                        | Default                        |
| ------------ | -------------------------- | ---------------------------------- | ------------------------------ |
| `id`         | `integer`                  | `NOT NULL`, `PRIMARY KEY`          | `nextval('cart_items_id_seq')` |
| `user_id`    | `bigint`                   | `NOT NULL`                         |                                |
| `product_id` | `integer`                  | `NOT NULL`                         |                                |
| `quantity`   | `integer`                  | `NOT NULL`, `CHECK (quantity > 0)` |                                |
| `added_at`   | `timestamp with time zone` |                                    | `CURRENT_TIMESTAMP`            |

**Constraints**

- `cart_items_user_id_product_id_key`: `UNIQUE` on (`user_id`, `product_id`).

**Foreign Keys**

- `cart_items_user_id_fkey`: `user_id` references `users(id)` on `DELETE CASCADE`.
- `cart_items_product_id_fkey`: `product_id` references `products(id)` on `DELETE CASCADE`.

**Indexes**

- `idx_cart_items_user_id`: B-tree on `user_id`.

---

### `orders`

Stores customer order information.

**Columns**

| Name               | Type                       | Constraints                                              | Default                    |
| ------------------ | -------------------------- | -------------------------------------------------------- | -------------------------- |
| `id`               | `integer`                  | `NOT NULL`, `PRIMARY KEY`                                | `nextval('orders_id_seq')` |
| `order_number`     | `VARCHAR(50)`              | `NOT NULL`,'UNIQUE'                                      |                            |
| `user_id`          | `bigint`                   | `NOT NULL`                                               |                            |
| `total_amount`     | `numeric(10,2)`            | `NOT NULL`, `CHECK (total_amount >= 0)`                  |                            |
| `status`           | `varchar(20)`              | `NOT NULL`, `CHECK (status IN ('pending', 'paid', ...))` |                            |
| `shipping_address` | `text`                     | `NOT NULL`                                               |                            |
| `order_note      ` | `text`                     |                                                          |                            |
| `recipient_name`   | `varchar(100)`             | `NOT NULL`                                               |                            |
| `recipient_phone`  | `varchar(20)`              | `NOT NULL`                                               |                            |
| `recipient_email`  | `varchar(255)`             | `NOT NULL`                                               |                            |
| `payment_method`   | `text`                     | `NOT NULL`                                               |                            |
| `created_at`       | `timestamp with time zone` |                                                          | `CURRENT_TIMESTAMP`        |
| `paid_at`          | `timestamp with time zone` |                                                          |                            |
| `updated_at`       | `timestamp with time zone` |                                                          | `CURRENT_TIMESTAMP`        |

**Foreign Keys**

- `orders_user_id_fkey`: `user_id` references `users(id)` on `DELETE RESTRICT`.

**Indexes**

- `idx_orders_user_id`: B-tree on `user_id`.

**Triggers**

- `update_orders_updated_at_column`: Before `UPDATE`, executes `update_updated_at_column()`.

---

### `order_items`

Stores the individual items within an order.

**Columns**
| Name | Type | Constraints | Default |
|---|---|---|---|
| `id` | `integer` | `NOT NULL`, `PRIMARY KEY` | `nextval('order_items_id_seq')` |
| `order_id` | `integer` | `NOT NULL` | |
| `product_id` | `integer` | `NOT NULL` | |
| `quantity` | `integer` | `NOT NULL`, `CHECK (quantity > 0)` | |
| `unit_price` | `numeric(10,2)` | `NOT NULL`, `CHECK (unit_price >= 0)` | |

**Foreign Keys**

- `order_items_order_id_fkey`: `order_id` references `orders(id)` on `DELETE CASCADE`.
- `order_items_product_id_fkey`: `product_id` references `products(id)` on `DELETE RESTRICT`.

**Indexes**

- `idx_order_items_order_id`: B-tree on `order_id`.

---

### `payments`

Stores payment transaction details for orders.

**Columns**
| Name | Type | Constraints | Default |
|---|---|---|---|
| `id` | `integer` | `NOT NULL`, `PRIMARY KEY` | `nextval('payments_id_seq')` |
| `order_id` | `integer` | | |
| `payment_method` | `text` | `NOT NULL` | |
| `transaction_id` | `text` | `NOT NULL`, `UNIQUE` | |
| `amount` | `numeric(10,2)` | `NOT NULL`, `CHECK (amount >= 0)` | |
| `status` | `text` | `NOT NULL`, `CHECK (status IN ('pending', 'paid', 'failed'))` | |
| `paid_at` | `timestamp with time zone` | | |
| `created_at` | `timestamp with time zone` | | `now()` |
| `updated_at` | `timestamp with time zone` | | `now()` |

**Foreign Keys**

- `payments_order_id_fkey`: `order_id` references `orders(id)` on `DELETE CASCADE`.

**Triggers**

- `set_payments_updated_at`: Before `UPDATE`, executes `update_updated_at_column()`.
