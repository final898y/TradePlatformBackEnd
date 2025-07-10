--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8
-- Dumped by pg_dump version 17.0

-- Started on 2025-06-29 18:04:35

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE postgres;
--
-- TOC entry 3807 (class 1262 OID 16978)
-- Name: postgres; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE postgres WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.UTF-8';


ALTER DATABASE postgres OWNER TO postgres;

\connect postgres

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 20 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 3809 (class 0 OID 0)
-- Dependencies: 20
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- TOC entry 333 (class 1255 OID 17195)
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 260 (class 1259 OID 17320)
-- Name: auth_providers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auth_providers (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    provider character varying(50) NOT NULL,
    provider_user_id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.auth_providers OWNER TO postgres;

--
-- TOC entry 261 (class 1259 OID 17324)
-- Name: auth_providers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.auth_providers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.auth_providers_id_seq OWNER TO postgres;

--
-- TOC entry 3813 (class 0 OID 0)
-- Dependencies: 261
-- Name: auth_providers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.auth_providers_id_seq OWNED BY public.auth_providers.id;


--
-- TOC entry 262 (class 1259 OID 17325)
-- Name: cart_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_items (
    id integer NOT NULL,
    user_id bigint NOT NULL,
    product_id integer NOT NULL,
    quantity integer NOT NULL,
    added_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT cart_items_quantity_check CHECK ((quantity > 0))
);


ALTER TABLE public.cart_items OWNER TO postgres;

--
-- TOC entry 263 (class 1259 OID 17330)
-- Name: cart_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cart_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cart_items_id_seq OWNER TO postgres;

--
-- TOC entry 3816 (class 0 OID 0)
-- Dependencies: 263
-- Name: cart_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cart_items_id_seq OWNED BY public.cart_items.id;


--
-- TOC entry 264 (class 1259 OID 17331)
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying(50) NOT NULL
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- TOC entry 265 (class 1259 OID 17334)
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO postgres;

--
-- TOC entry 3819 (class 0 OID 0)
-- Dependencies: 265
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- TOC entry 266 (class 1259 OID 17335)
-- Name: order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_items (
    id integer NOT NULL,
    order_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer NOT NULL,
    unit_price numeric(10,2) NOT NULL,
    CONSTRAINT order_items_quantity_check CHECK ((quantity > 0)),
    CONSTRAINT order_items_unit_price_check CHECK ((unit_price >= (0)::numeric))
);


ALTER TABLE public.order_items OWNER TO postgres;

--
-- TOC entry 267 (class 1259 OID 17340)
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_items_id_seq OWNER TO postgres;

--
-- TOC entry 3822 (class 0 OID 0)
-- Dependencies: 267
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;


--
-- TOC entry 268 (class 1259 OID 17341)
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    user_id bigint NOT NULL,
    total_amount numeric(10,2) NOT NULL,
    status character varying(20) NOT NULL,
    shipping_address text NOT NULL,
    recipient_name character varying(100) NOT NULL,
    recipient_phone character varying(20) NOT NULL,
    payment_method text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    paid_at timestamp with time zone,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT orders_status_check CHECK (((status)::text = ANY (ARRAY[('pending'::character varying)::text, ('paid'::character varying)::text, ('shipped'::character varying)::text, ('delivered'::character varying)::text, ('cancelled'::character varying)::text]))),
    CONSTRAINT orders_total_amount_check CHECK ((total_amount >= (0)::numeric))
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- TOC entry 269 (class 1259 OID 17349)
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_id_seq OWNER TO postgres;

--
-- TOC entry 3825 (class 0 OID 0)
-- Dependencies: 269
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- TOC entry 291 (class 1259 OID 25743)
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id integer NOT NULL,
    order_id integer,
    payment_method text NOT NULL,
    transaction_id text NOT NULL,
    amount numeric(10,2) NOT NULL,
    status text NOT NULL,
    paid_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT payments_amount_check CHECK ((amount >= (0)::numeric)),
    CONSTRAINT payments_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'paid'::text, 'failed'::text])))
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- TOC entry 290 (class 1259 OID 25742)
-- Name: payments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payments_id_seq OWNER TO postgres;

--
-- TOC entry 3828 (class 0 OID 0)
-- Dependencies: 290
-- Name: payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payments_id_seq OWNED BY public.payments.id;


--
-- TOC entry 289 (class 1259 OID 25703)
-- Name: product_specs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_specs (
    id integer NOT NULL,
    product_id integer,
    spec_name text NOT NULL,
    spec_value text NOT NULL,
    extra_price numeric(10,2) DEFAULT 0.00,
    stock integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT product_specs_stock_check CHECK ((stock >= 0))
);


ALTER TABLE public.product_specs OWNER TO postgres;

--
-- TOC entry 288 (class 1259 OID 25702)
-- Name: product_specs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_specs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_specs_id_seq OWNER TO postgres;

--
-- TOC entry 3831 (class 0 OID 0)
-- Dependencies: 288
-- Name: product_specs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_specs_id_seq OWNED BY public.product_specs.id;


--
-- TOC entry 287 (class 1259 OID 18975)
-- Name: product_status_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_status_history (
    id integer NOT NULL,
    product_id integer NOT NULL,
    status text NOT NULL,
    reason text,
    operated_by text,
    operated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.product_status_history OWNER TO postgres;

--
-- TOC entry 286 (class 1259 OID 18974)
-- Name: product_status_history_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_status_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_status_history_id_seq OWNER TO postgres;

--
-- TOC entry 3834 (class 0 OID 0)
-- Dependencies: 286
-- Name: product_status_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_status_history_id_seq OWNED BY public.product_status_history.id;


--
-- TOC entry 270 (class 1259 OID 17350)
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    price numeric(10,2) NOT NULL,
    description text,
    stock integer NOT NULL,
    image_url character varying(255),
    category_id integer NOT NULL,
    sub_category_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    is_published boolean DEFAULT false NOT NULL,
    publish_at timestamp with time zone,
    unpublish_at timestamp with time zone,
    is_deleted boolean DEFAULT false NOT NULL,
    CONSTRAINT products_price_check CHECK ((price >= (0)::numeric)),
    CONSTRAINT products_stock_check CHECK ((stock >= 0))
);


ALTER TABLE public.products OWNER TO postgres;

--
-- TOC entry 271 (class 1259 OID 17359)
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO postgres;

--
-- TOC entry 3837 (class 0 OID 0)
-- Dependencies: 271
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- TOC entry 272 (class 1259 OID 17360)
-- Name: sub_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sub_categories (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    category_id integer NOT NULL
);


ALTER TABLE public.sub_categories OWNER TO postgres;

--
-- TOC entry 273 (class 1259 OID 17363)
-- Name: sub_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sub_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sub_categories_id_seq OWNER TO postgres;

--
-- TOC entry 3840 (class 0 OID 0)
-- Dependencies: 273
-- Name: sub_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sub_categories_id_seq OWNED BY public.sub_categories.id;


--
-- TOC entry 274 (class 1259 OID 17364)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    uuid uuid NOT NULL,
    email character varying(255),
    password_hash character varying(255),
    name character varying(100),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    mobilephone text DEFAULT ''::text NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 275 (class 1259 OID 17372)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 3843 (class 0 OID 0)
-- Dependencies: 275
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 3513 (class 2604 OID 17431)
-- Name: auth_providers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_providers ALTER COLUMN id SET DEFAULT nextval('public.auth_providers_id_seq'::regclass);


--
-- TOC entry 3515 (class 2604 OID 17432)
-- Name: cart_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items ALTER COLUMN id SET DEFAULT nextval('public.cart_items_id_seq'::regclass);


--
-- TOC entry 3517 (class 2604 OID 17433)
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- TOC entry 3518 (class 2604 OID 17434)
-- Name: order_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);


--
-- TOC entry 3519 (class 2604 OID 17435)
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- TOC entry 3539 (class 2604 OID 25746)
-- Name: payments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments ALTER COLUMN id SET DEFAULT nextval('public.payments_id_seq'::regclass);


--
-- TOC entry 3534 (class 2604 OID 25706)
-- Name: product_specs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_specs ALTER COLUMN id SET DEFAULT nextval('public.product_specs_id_seq'::regclass);


--
-- TOC entry 3532 (class 2604 OID 18978)
-- Name: product_status_history id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_status_history ALTER COLUMN id SET DEFAULT nextval('public.product_status_history_id_seq'::regclass);


--
-- TOC entry 3522 (class 2604 OID 17436)
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- TOC entry 3527 (class 2604 OID 17437)
-- Name: sub_categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sub_categories ALTER COLUMN id SET DEFAULT nextval('public.sub_categories_id_seq'::regclass);


--
-- TOC entry 3528 (class 2604 OID 17438)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 3780 (class 0 OID 17320)
-- Dependencies: 260
-- Data for Name: auth_providers; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.auth_providers VALUES (2, 2, 'email', 'bob@example.com', '2024-01-02 11:00:00+00');
INSERT INTO public.auth_providers VALUES (4, 4, 'email', 'david@example.com', '2024-01-04 13:00:00+00');
INSERT INTO public.auth_providers VALUES (5, 5, 'facebook', 'fb-uid-12345', '2024-01-05 14:00:00+00');
INSERT INTO public.auth_providers VALUES (6, 6, 'email', 'frank@example.com', '2024-01-06 15:00:00+00');
INSERT INTO public.auth_providers VALUES (7, 6, 'github', 'github-uid-0099', '2024-01-06 15:10:00+00');
INSERT INTO public.auth_providers VALUES (1, 1, 'email', 'final898y@gmail.com', '2024-01-01 10:00:00+00');
INSERT INTO public.auth_providers VALUES (8, 2, 'google', 'fly@gmail.com', '2025-04-24 13:55:13.241334+00');
INSERT INTO public.auth_providers VALUES (3, 3, 'google', '103350333967189701229', '2024-01-03 12:00:00+00');


--
-- TOC entry 3782 (class 0 OID 17325)
-- Dependencies: 262
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3784 (class 0 OID 17331)
-- Dependencies: 264
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.categories VALUES (1, '電子產品');
INSERT INTO public.categories VALUES (2, '服飾');
INSERT INTO public.categories VALUES (3, '書籍');
INSERT INTO public.categories VALUES (4, '家居用品');


--
-- TOC entry 3786 (class 0 OID 17335)
-- Dependencies: 266
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3788 (class 0 OID 17341)
-- Dependencies: 268
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3801 (class 0 OID 25743)
-- Dependencies: 291
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3799 (class 0 OID 25703)
-- Dependencies: 289
-- Data for Name: product_specs; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3797 (class 0 OID 18975)
-- Dependencies: 287
-- Data for Name: product_status_history; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3790 (class 0 OID 17350)
-- Dependencies: 270
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.products VALUES (1, '手機', 599.00, '一款高性能的智能手機，配備最新處理器和高清螢幕。', 10, '/products/phone.jpg', 1, 1, '2025-06-08 13:06:28.889874+00', '2025-06-08 13:06:28.889874+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (2, 'T恤', 29.00, '舒適的棉質T恤，適合日常穿著，多種顏色可選。', 50, '/products/tshirt.jpg', 2, 4, '2025-06-08 13:06:28.889874+00', '2025-06-08 13:06:28.889874+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (3, '書', 15.00, '一本暢銷小說，適合所有年齡層閱讀。', 100, '/products/book.jpg', 3, 7, '2025-06-08 13:06:28.889874+00', '2025-06-08 13:06:28.889874+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (4, '筆電', 999.00, '高效能筆記型電腦，適合工作和娛樂。', 5, '/NoImage.png', 1, 2, '2025-06-08 13:06:28.889874+00', '2025-06-08 13:06:28.889874+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (5, '沙發', 499.00, '舒適的現代風格沙發，適合客廳使用。', 8, '/NoImage.png', 4, 10, '2025-06-08 13:06:28.889874+00', '2025-06-08 13:06:28.889874+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (6, '無線耳機', 129.00, '降噪無線耳機，支援藍牙5.0與快速充電。', 20, '/NoImage.png', 1, 3, '2025-06-23 14:01:29.15144+00', '2025-06-23 14:01:29.15144+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (7, '平板電腦', 349.00, '輕薄平板，適合影音與學習使用。', 12, '/NoImage.png', 1, 2, '2025-06-23 14:01:29.15144+00', '2025-06-23 14:01:29.15144+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (8, '牛仔褲', 49.00, '修身剪裁牛仔褲，適合各種場合。', 30, '/NoImage.png', 2, 5, '2025-06-23 14:01:29.15144+00', '2025-06-23 14:01:29.15144+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (9, '運動鞋', 89.00, '輕量跑鞋，適合日常運動。', 25, '/NoImage.png', 2, 6, '2025-06-23 14:01:29.15144+00', '2025-06-23 14:01:29.15144+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (10, '程式設計入門', 35.00, '學習程式的最佳入門教材，適合初學者。', 40, '/NoImage.png', 3, 8, '2025-06-23 14:01:29.15144+00', '2025-06-23 14:01:29.15144+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (11, '經典漫畫', 22.00, '全彩經典漫畫，一次收藏全套。', 15, '/NoImage.png', 3, 9, '2025-06-23 14:01:29.15144+00', '2025-06-23 14:01:29.15144+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (12, '料理刀組', 79.00, '不鏽鋼多功能料理刀組，包含7件套裝。', 18, '/NoImage.png', 4, 11, '2025-06-23 14:01:29.15144+00', '2025-06-23 14:01:29.15144+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (13, '桌燈', 39.00, 'LED調光桌燈，適合閱讀與工作。', 28, '/NoImage.png', 4, 12, '2025-06-23 14:01:29.15144+00', '2025-06-23 14:01:29.15144+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (14, '抱枕', 19.00, '柔軟舒適的抱枕，多種顏色可選。', 50, '/NoImage.png', 4, 10, '2025-06-23 14:01:29.15144+00', '2025-06-23 14:01:29.15144+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (4001, '手機 商品1', 251.41, '這是 手機 類別的商品，編號 1，用於展示用途。', 20, '/NoImage.png', 1, 1, '2025-06-23 15:26:25.909901+00', '2025-06-23 15:26:25.909901+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (4002, '手機 商品2', 493.55, '這是 手機 類別的商品，編號 2，用於展示用途。', 11, '/NoImage.png', 1, 1, '2025-06-23 15:26:25.909901+00', '2025-06-23 15:26:25.909901+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (4003, '手機 商品3', 958.22, '這是 手機 類別的商品，編號 3，用於展示用途。', 89, '/NoImage.png', 1, 1, '2025-06-23 15:26:25.909901+00', '2025-06-23 15:26:25.909901+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (4004, '手機 商品4', 636.60, '這是 手機 類別的商品，編號 4，用於展示用途。', 8, '/NoImage.png', 1, 1, '2025-06-23 15:26:25.909901+00', '2025-06-23 15:26:25.909901+00', false, NULL, NULL, false);
INSERT INTO public.products VALUES (4005, '手機 商品5', 543.29, '這是 手機 類別的商品，編號 5，用於展示用途。', 48, '/NoImage.png', 1, 1, '2025-06-23 15:26:25.909901+00', '2025-06-23 15:26:25.909901+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (4006, '手機 商品6', 750.88, '這是 手機 類別的商品，編號 6，用於展示用途。', 16, '/NoImage.png', 1, 1, '2025-06-23 15:26:25.909901+00', '2025-06-23 15:26:25.909901+00', false, NULL, NULL, false);
INSERT INTO public.products VALUES (4007, '手機 商品7', 588.20, '這是 手機 類別的商品，編號 7，用於展示用途。', 12, '/NoImage.png', 1, 1, '2025-06-23 15:26:25.909901+00', '2025-06-23 15:26:25.909901+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (4008, '手機 商品8', 614.86, '這是 手機 類別的商品，編號 8，用於展示用途。', 58, '/NoImage.png', 1, 1, '2025-06-23 15:26:25.909901+00', '2025-06-23 15:26:25.909901+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (4009, '手機 商品9', 93.21, '這是 手機 類別的商品，編號 9，用於展示用途。', 76, '/NoImage.png', 1, 1, '2025-06-23 15:26:25.909901+00', '2025-06-23 15:26:25.909901+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (4010, '手機 商品10', 64.47, '這是 手機 類別的商品，編號 10，用於展示用途。', 70, '/NoImage.png', 1, 1, '2025-06-23 15:26:25.909901+00', '2025-06-23 15:26:25.909901+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (4011, '手機 商品11', 456.31, '這是 手機 類別的商品，編號 11，用於展示用途。', 0, '/NoImage.png', 1, 1, '2025-06-23 15:26:25.909901+00', '2025-06-23 15:26:25.909901+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (4012, '手機 商品12', 665.19, '這是 手機 類別的商品，編號 12，用於展示用途。', 3, '/NoImage.png', 1, 1, '2025-06-23 15:26:25.909901+00', '2025-06-23 15:26:25.909901+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (4013, '手機 商品13', 596.78, '這是 手機 類別的商品，編號 13，用於展示用途。', 94, '/NoImage.png', 1, 1, '2025-06-23 15:26:25.909901+00', '2025-06-23 15:26:25.909901+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (4014, '手機 商品14', 246.88, '這是 手機 類別的商品，編號 14，用於展示用途。', 8, '/NoImage.png', 1, 1, '2025-06-23 15:26:25.909901+00', '2025-06-23 15:26:25.909901+00', false, NULL, NULL, false);
INSERT INTO public.products VALUES (4015, '手機 商品15', 369.92, '這是 手機 類別的商品，編號 15，用於展示用途。', 67, '/NoImage.png', 1, 1, '2025-06-23 15:26:25.909901+00', '2025-06-23 15:26:25.909901+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (4016, '手機 商品16', 379.67, '這是 手機 類別的商品，編號 16，用於展示用途。', 78, '/NoImage.png', 1, 1, '2025-06-23 15:26:25.909901+00', '2025-06-23 15:26:25.909901+00', false, NULL, NULL, false);
INSERT INTO public.products VALUES (4017, '手機 商品17', 737.79, '這是 手機 類別的商品，編號 17，用於展示用途。', 8, '/NoImage.png', 1, 1, '2025-06-23 15:26:25.909901+00', '2025-06-23 15:26:25.909901+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (4018, '手機 商品18', 247.04, '這是 手機 類別的商品，編號 18，用於展示用途。', 97, '/NoImage.png', 1, 1, '2025-06-23 15:26:25.909901+00', '2025-06-23 15:26:25.909901+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (4019, '手機 商品19', 736.30, '這是 手機 類別的商品，編號 19，用於展示用途。', 20, '/NoImage.png', 1, 1, '2025-06-23 15:26:25.909901+00', '2025-06-23 15:26:25.909901+00', false, NULL, NULL, false);
INSERT INTO public.products VALUES (4020, '手機 商品20', 74.41, '這是 手機 類別的商品，編號 20，用於展示用途。', 94, '/NoImage.png', 1, 1, '2025-06-23 15:26:25.909901+00', '2025-06-23 15:26:25.909901+00', false, NULL, NULL, false);
INSERT INTO public.products VALUES (4021, '手機 商品21', 18.80, '這是 手機 類別的商品，編號 21，用於展示用途。', 82, '/NoImage.png', 1, 1, '2025-06-23 15:26:25.909901+00', '2025-06-23 15:26:25.909901+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (4022, '手機 商品22', 234.16, '這是 手機 類別的商品，編號 22，用於展示用途。', 27, '/NoImage.png', 1, 1, '2025-06-23 15:26:25.909901+00', '2025-06-23 15:26:25.909901+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (4023, '手機 商品23', 101.17, '這是 手機 類別的商品，編號 23，用於展示用途。', 31, '/NoImage.png', 1, 1, '2025-06-23 15:26:25.909901+00', '2025-06-23 15:26:25.909901+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (4024, '手機 商品24', 129.78, '這是 手機 類別的商品，編號 24，用於展示用途。', 36, '/NoImage.png', 1, 1, '2025-06-23 15:26:25.909901+00', '2025-06-23 15:26:25.909901+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (4025, '手機 商品25', 157.74, '這是 手機 類別的商品，編號 25，用於展示用途。', 67, '/NoImage.png', 1, 1, '2025-06-23 15:26:25.909901+00', '2025-06-23 15:26:25.909901+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (4026, '手機 商品26', 170.01, '這是 手機 類別的商品，編號 26，用於展示用途。', 46, '/NoImage.png', 1, 1, '2025-06-23 15:26:25.909901+00', '2025-06-23 15:26:25.909901+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (4027, '手機 商品27', 903.41, '這是 手機 類別的商品，編號 27，用於展示用途。', 55, '/NoImage.png', 1, 1, '2025-06-23 15:26:25.909901+00', '2025-06-23 15:26:25.909901+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (4028, '手機 商品28', 176.21, '這是 手機 類別的商品，編號 28，用於展示用途。', 58, '/NoImage.png', 1, 1, '2025-06-23 15:26:25.909901+00', '2025-06-23 15:26:25.909901+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (4029, '手機 商品29', 516.71, '這是 手機 類別的商品，編號 29，用於展示用途。', 27, '/NoImage.png', 1, 1, '2025-06-23 15:26:25.909901+00', '2025-06-23 15:26:25.909901+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (4030, '手機 商品30', 820.19, '這是 手機 類別的商品，編號 30，用於展示用途。', 17, '/NoImage.png', 1, 1, '2025-06-23 15:26:25.909901+00', '2025-06-23 15:26:25.909901+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (4031, '手機 商品31', 615.34, '這是 手機 類別的商品，編號 31，用於展示用途。', 59, '/NoImage.png', 1, 1, '2025-06-23 15:26:25.909901+00', '2025-06-23 15:26:25.909901+00', false, NULL, NULL, false);
INSERT INTO public.products VALUES (4032, '手機 商品32', 668.45, '這是 手機 類別的商品，編號 32，用於展示用途。', 39, '/NoImage.png', 1, 1, '2025-06-23 15:26:25.909901+00', '2025-06-23 15:26:25.909901+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (4033, '手機 商品33', 591.80, '這是 手機 類別的商品，編號 33，用於展示用途。', 46, '/NoImage.png', 1, 1, '2025-06-23 15:26:25.909901+00', '2025-06-23 15:26:25.909901+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (4034, '手機 商品34', 275.34, '這是 手機 類別的商品，編號 34，用於展示用途。', 17, '/NoImage.png', 1, 1, '2025-06-23 15:26:25.909901+00', '2025-06-23 15:26:25.909901+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (4035, '手機 商品35', 425.13, '這是 手機 類別的商品，編號 35，用於展示用途。', 12, '/NoImage.png', 1, 1, '2025-06-23 15:26:25.909901+00', '2025-06-23 15:26:25.909901+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (4036, '手機 商品36', 87.53, '這是 手機 類別的商品，編號 36，用於展示用途。', 66, '/NoImage.png', 1, 1, '2025-06-23 15:26:25.909901+00', '2025-06-23 15:26:25.909901+00', false, NULL, NULL, false);
INSERT INTO public.products VALUES (4037, '手機 商品37', 618.62, '這是 手機 類別的商品，編號 37，用於展示用途。', 75, '/NoImage.png', 1, 1, '2025-06-23 15:26:25.909901+00', '2025-06-23 15:26:25.909901+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (4038, '手機 商品38', 349.96, '這是 手機 類別的商品，編號 38，用於展示用途。', 19, '/NoImage.png', 1, 1, '2025-06-23 15:26:25.909901+00', '2025-06-23 15:26:25.909901+00', false, NULL, NULL, false);
INSERT INTO public.products VALUES (4039, '手機 商品39', 364.14, '這是 手機 類別的商品，編號 39，用於展示用途。', 39, '/NoImage.png', 1, 1, '2025-06-23 15:26:25.909901+00', '2025-06-23 15:26:25.909901+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (4040, '手機 商品40', 881.78, '這是 手機 類別的商品，編號 40，用於展示用途。', 47, '/NoImage.png', 1, 1, '2025-06-23 15:26:25.909901+00', '2025-06-23 15:26:25.909901+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (4041, '手機 商品41', 86.08, '這是 手機 類別的商品，編號 41，用於展示用途。', 21, '/NoImage.png', 1, 1, '2025-06-23 15:26:25.909901+00', '2025-06-23 15:26:25.909901+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (4042, '手機 商品42', 118.18, '這是 手機 類別的商品，編號 42，用於展示用途。', 86, '/NoImage.png', 1, 1, '2025-06-23 15:26:25.909901+00', '2025-06-23 15:26:25.909901+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (4043, '手機 商品43', 399.71, '這是 手機 類別的商品，編號 43，用於展示用途。', 30, '/NoImage.png', 1, 1, '2025-06-23 15:26:25.909901+00', '2025-06-23 15:26:25.909901+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (4044, '手機 商品44', 79.01, '這是 手機 類別的商品，編號 44，用於展示用途。', 69, '/NoImage.png', 1, 1, '2025-06-23 15:26:25.909901+00', '2025-06-23 15:26:25.909901+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (4045, '手機 商品45', 125.00, '這是 手機 類別的商品，編號 45，用於展示用途。', 38, '/NoImage.png', 1, 1, '2025-06-23 15:26:25.909901+00', '2025-06-23 15:26:25.909901+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (4046, '手機 商品46', 472.94, '這是 手機 類別的商品，編號 46，用於展示用途。', 98, '/NoImage.png', 1, 1, '2025-06-23 15:26:25.909901+00', '2025-06-23 15:26:25.909901+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (4047, '手機 商品47', 538.98, '這是 手機 類別的商品，編號 47，用於展示用途。', 65, '/NoImage.png', 1, 1, '2025-06-23 15:26:25.909901+00', '2025-06-23 15:26:25.909901+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (4048, '手機 商品48', 316.04, '這是 手機 類別的商品，編號 48，用於展示用途。', 97, '/NoImage.png', 1, 1, '2025-06-23 15:26:25.909901+00', '2025-06-23 15:26:25.909901+00', false, NULL, NULL, false);
INSERT INTO public.products VALUES (4049, '手機 商品49', 934.94, '這是 手機 類別的商品，編號 49，用於展示用途。', 17, '/NoImage.png', 1, 1, '2025-06-23 15:26:25.909901+00', '2025-06-23 15:26:25.909901+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (4050, '手機 商品50', 803.92, '這是 手機 類別的商品，編號 50，用於展示用途。', 88, '/NoImage.png', 1, 1, '2025-06-23 15:26:25.909901+00', '2025-06-23 15:26:25.909901+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (5101, '配件 商品1', 408.37, '這是 配件 類別的商品，編號 1，用於展示用途。', 29, '/NoImage.png', 1, 3, '2025-06-23 15:28:52.29876+00', '2025-06-23 15:28:52.29876+00', false, NULL, NULL, false);
INSERT INTO public.products VALUES (5201, '上衣 商品1', 634.97, '這是 上衣 類別的商品，編號 1，用於展示用途。', 10, '/NoImage.png', 2, 4, '2025-06-23 15:28:52.29876+00', '2025-06-23 15:28:52.29876+00', false, NULL, NULL, false);
INSERT INTO public.products VALUES (5301, '教材 商品1', 27.53, '這是 教材 類別的商品，編號 1，用於展示用途。', 62, '/NoImage.png', 3, 8, '2025-06-23 15:28:52.29876+00', '2025-06-23 15:28:52.29876+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (5401, '家具 商品1', 100.47, '這是 家具 類別的商品，編號 1，用於展示用途。', 43, '/NoImage.png', 4, 10, '2025-06-23 15:28:52.29876+00', '2025-06-23 15:28:52.29876+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (5102, '配件 商品2', 230.90, '這是 配件 類別的商品，編號 2，用於展示用途。', 29, '/NoImage.png', 1, 3, '2025-06-23 15:28:52.29876+00', '2025-06-23 15:28:52.29876+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (5202, '上衣 商品2', 832.89, '這是 上衣 類別的商品，編號 2，用於展示用途。', 7, '/NoImage.png', 2, 4, '2025-06-23 15:28:52.29876+00', '2025-06-23 15:28:52.29876+00', false, NULL, NULL, false);
INSERT INTO public.products VALUES (5302, '教材 商品2', 711.20, '這是 教材 類別的商品，編號 2，用於展示用途。', 95, '/NoImage.png', 3, 8, '2025-06-23 15:28:52.29876+00', '2025-06-23 15:28:52.29876+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (5402, '家具 商品2', 942.11, '這是 家具 類別的商品，編號 2，用於展示用途。', 28, '/NoImage.png', 4, 10, '2025-06-23 15:28:52.29876+00', '2025-06-23 15:28:52.29876+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (5103, '配件 商品3', 700.04, '這是 配件 類別的商品，編號 3，用於展示用途。', 73, '/NoImage.png', 1, 3, '2025-06-23 15:28:52.29876+00', '2025-06-23 15:28:52.29876+00', false, NULL, NULL, false);
INSERT INTO public.products VALUES (5203, '上衣 商品3', 379.17, '這是 上衣 類別的商品，編號 3，用於展示用途。', 9, '/NoImage.png', 2, 4, '2025-06-23 15:28:52.29876+00', '2025-06-23 15:28:52.29876+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (5303, '教材 商品3', 275.44, '這是 教材 類別的商品，編號 3，用於展示用途。', 16, '/NoImage.png', 3, 8, '2025-06-23 15:28:52.29876+00', '2025-06-23 15:28:52.29876+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (5403, '家具 商品3', 124.89, '這是 家具 類別的商品，編號 3，用於展示用途。', 13, '/NoImage.png', 4, 10, '2025-06-23 15:28:52.29876+00', '2025-06-23 15:28:52.29876+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (5104, '配件 商品4', 604.28, '這是 配件 類別的商品，編號 4，用於展示用途。', 34, '/NoImage.png', 1, 3, '2025-06-23 15:28:52.29876+00', '2025-06-23 15:28:52.29876+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (5204, '上衣 商品4', 460.06, '這是 上衣 類別的商品，編號 4，用於展示用途。', 98, '/NoImage.png', 2, 4, '2025-06-23 15:28:52.29876+00', '2025-06-23 15:28:52.29876+00', false, NULL, NULL, false);
INSERT INTO public.products VALUES (5304, '教材 商品4', 50.72, '這是 教材 類別的商品，編號 4，用於展示用途。', 94, '/NoImage.png', 3, 8, '2025-06-23 15:28:52.29876+00', '2025-06-23 15:28:52.29876+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (5404, '家具 商品4', 79.65, '這是 家具 類別的商品，編號 4，用於展示用途。', 47, '/NoImage.png', 4, 10, '2025-06-23 15:28:52.29876+00', '2025-06-23 15:28:52.29876+00', false, NULL, NULL, false);
INSERT INTO public.products VALUES (5105, '配件 商品5', 893.64, '這是 配件 類別的商品，編號 5，用於展示用途。', 87, '/NoImage.png', 1, 3, '2025-06-23 15:28:52.29876+00', '2025-06-23 15:28:52.29876+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (5205, '上衣 商品5', 176.78, '這是 上衣 類別的商品，編號 5，用於展示用途。', 98, '/NoImage.png', 2, 4, '2025-06-23 15:28:52.29876+00', '2025-06-23 15:28:52.29876+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (5305, '教材 商品5', 548.02, '這是 教材 類別的商品，編號 5，用於展示用途。', 89, '/NoImage.png', 3, 8, '2025-06-23 15:28:52.29876+00', '2025-06-23 15:28:52.29876+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (5405, '家具 商品5', 989.74, '這是 家具 類別的商品，編號 5，用於展示用途。', 90, '/NoImage.png', 4, 10, '2025-06-23 15:28:52.29876+00', '2025-06-23 15:28:52.29876+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (5106, '配件 商品6', 751.53, '這是 配件 類別的商品，編號 6，用於展示用途。', 37, '/NoImage.png', 1, 3, '2025-06-23 15:28:52.29876+00', '2025-06-23 15:28:52.29876+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (5206, '上衣 商品6', 885.66, '這是 上衣 類別的商品，編號 6，用於展示用途。', 61, '/NoImage.png', 2, 4, '2025-06-23 15:28:52.29876+00', '2025-06-23 15:28:52.29876+00', false, NULL, NULL, false);
INSERT INTO public.products VALUES (5306, '教材 商品6', 739.61, '這是 教材 類別的商品，編號 6，用於展示用途。', 96, '/NoImage.png', 3, 8, '2025-06-23 15:28:52.29876+00', '2025-06-23 15:28:52.29876+00', false, NULL, NULL, false);
INSERT INTO public.products VALUES (5406, '家具 商品6', 655.65, '這是 家具 類別的商品，編號 6，用於展示用途。', 8, '/NoImage.png', 4, 10, '2025-06-23 15:28:52.29876+00', '2025-06-23 15:28:52.29876+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (5107, '配件 商品7', 194.45, '這是 配件 類別的商品，編號 7，用於展示用途。', 83, '/NoImage.png', 1, 3, '2025-06-23 15:28:52.29876+00', '2025-06-23 15:28:52.29876+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (5207, '上衣 商品7', 486.89, '這是 上衣 類別的商品，編號 7，用於展示用途。', 10, '/NoImage.png', 2, 4, '2025-06-23 15:28:52.29876+00', '2025-06-23 15:28:52.29876+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (5307, '教材 商品7', 518.48, '這是 教材 類別的商品，編號 7，用於展示用途。', 78, '/NoImage.png', 3, 8, '2025-06-23 15:28:52.29876+00', '2025-06-23 15:28:52.29876+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (5407, '家具 商品7', 726.15, '這是 家具 類別的商品，編號 7，用於展示用途。', 77, '/NoImage.png', 4, 10, '2025-06-23 15:28:52.29876+00', '2025-06-23 15:28:52.29876+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (5108, '配件 商品8', 502.79, '這是 配件 類別的商品，編號 8，用於展示用途。', 39, '/NoImage.png', 1, 3, '2025-06-23 15:28:52.29876+00', '2025-06-23 15:28:52.29876+00', false, NULL, NULL, false);
INSERT INTO public.products VALUES (5208, '上衣 商品8', 484.27, '這是 上衣 類別的商品，編號 8，用於展示用途。', 46, '/NoImage.png', 2, 4, '2025-06-23 15:28:52.29876+00', '2025-06-23 15:28:52.29876+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (5308, '教材 商品8', 528.93, '這是 教材 類別的商品，編號 8，用於展示用途。', 75, '/NoImage.png', 3, 8, '2025-06-23 15:28:52.29876+00', '2025-06-23 15:28:52.29876+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (5408, '家具 商品8', 293.29, '這是 家具 類別的商品，編號 8，用於展示用途。', 70, '/NoImage.png', 4, 10, '2025-06-23 15:28:52.29876+00', '2025-06-23 15:28:52.29876+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (5109, '配件 商品9', 491.29, '這是 配件 類別的商品，編號 9，用於展示用途。', 40, '/NoImage.png', 1, 3, '2025-06-23 15:28:52.29876+00', '2025-06-23 15:28:52.29876+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (5209, '上衣 商品9', 506.76, '這是 上衣 類別的商品，編號 9，用於展示用途。', 7, '/NoImage.png', 2, 4, '2025-06-23 15:28:52.29876+00', '2025-06-23 15:28:52.29876+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (5309, '教材 商品9', 608.46, '這是 教材 類別的商品，編號 9，用於展示用途。', 56, '/NoImage.png', 3, 8, '2025-06-23 15:28:52.29876+00', '2025-06-23 15:28:52.29876+00', false, NULL, NULL, false);
INSERT INTO public.products VALUES (5409, '家具 商品9', 774.64, '這是 家具 類別的商品，編號 9，用於展示用途。', 69, '/NoImage.png', 4, 10, '2025-06-23 15:28:52.29876+00', '2025-06-23 15:28:52.29876+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (5110, '配件 商品10', 514.09, '這是 配件 類別的商品，編號 10，用於展示用途。', 18, '/NoImage.png', 1, 3, '2025-06-23 15:28:52.29876+00', '2025-06-23 15:28:52.29876+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (5210, '上衣 商品10', 227.04, '這是 上衣 類別的商品，編號 10，用於展示用途。', 85, '/NoImage.png', 2, 4, '2025-06-23 15:28:52.29876+00', '2025-06-23 15:28:52.29876+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (5310, '教材 商品10', 546.12, '這是 教材 類別的商品，編號 10，用於展示用途。', 62, '/NoImage.png', 3, 8, '2025-06-23 15:28:52.29876+00', '2025-06-23 15:28:52.29876+00', true, NULL, NULL, false);
INSERT INTO public.products VALUES (5410, '家具 商品10', 837.17, '這是 家具 類別的商品，編號 10，用於展示用途。', 54, '/NoImage.png', 4, 10, '2025-06-23 15:28:52.29876+00', '2025-06-23 15:28:52.29876+00', true, NULL, NULL, false);


--
-- TOC entry 3792 (class 0 OID 17360)
-- Dependencies: 272
-- Data for Name: sub_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.sub_categories VALUES (1, '手機', 1);
INSERT INTO public.sub_categories VALUES (2, '筆電', 1);
INSERT INTO public.sub_categories VALUES (3, '配件', 1);
INSERT INTO public.sub_categories VALUES (4, '上衣', 2);
INSERT INTO public.sub_categories VALUES (5, '褲子', 2);
INSERT INTO public.sub_categories VALUES (6, '鞋子', 2);
INSERT INTO public.sub_categories VALUES (7, '小說', 3);
INSERT INTO public.sub_categories VALUES (8, '教材', 3);
INSERT INTO public.sub_categories VALUES (9, '漫畫', 3);
INSERT INTO public.sub_categories VALUES (10, '家具', 4);
INSERT INTO public.sub_categories VALUES (11, '廚具', 4);
INSERT INTO public.sub_categories VALUES (12, '裝飾', 4);


--
-- TOC entry 3794 (class 0 OID 17364)
-- Dependencies: 274
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users VALUES (3, '19de471a-2391-4205-baa9-774a691ca256', 'jpacg898y@gmail.com', NULL, 'Charlie (Google)', '2024-01-03 12:00:00+00', '2025-04-25 14:53:23.973773+00', '0981646000');
INSERT INTO public.users VALUES (2, 'f91229c5-e106-476c-a2ab-086f69ffb3ad', 'bob@example.com', 'hashed_password2', 'Bob', '2024-01-02 11:00:00+00', '2025-04-25 14:53:32.449434+00', '0981000000');
INSERT INTO public.users VALUES (1, '77ac029a-a4cf-4cbc-98d5-e56c7e8bcb50', 'alice@example.com', 'hashed_password1', 'Alice', '2024-01-01 10:00:00+00', '2025-04-25 14:53:44.465785+00', '0981666666');
INSERT INTO public.users VALUES (4, '62cc569a-209e-4770-a5c7-ee89242d9c94', 'david@example.com', 'hashed_password4', 'David', '2024-01-04 13:00:00+00', '2025-04-25 14:53:57.70957+00', '0981000001');
INSERT INTO public.users VALUES (5, '591c04d3-961c-4c7a-9a5f-748547af0d1f', NULL, NULL, 'Eve (Facebook)', '2024-01-05 14:00:00+00', '2025-04-25 14:54:00.735876+00', '0981000002');
INSERT INTO public.users VALUES (6, 'd642836b-6eb8-447c-8c2c-863062b07cfd', 'frank@example.com', 'hashed_password6', 'Frank', '2024-01-06 15:00:00+00', '2025-04-25 14:54:04.403329+00', '0981000003');


--
-- TOC entry 3845 (class 0 OID 0)
-- Dependencies: 261
-- Name: auth_providers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auth_providers_id_seq', 8, true);


--
-- TOC entry 3846 (class 0 OID 0)
-- Dependencies: 263
-- Name: cart_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cart_items_id_seq', 1, false);


--
-- TOC entry 3847 (class 0 OID 0)
-- Dependencies: 265
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 4, true);


--
-- TOC entry 3848 (class 0 OID 0)
-- Dependencies: 267
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_items_id_seq', 1, false);


--
-- TOC entry 3849 (class 0 OID 0)
-- Dependencies: 269
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_id_seq', 1, false);


--
-- TOC entry 3850 (class 0 OID 0)
-- Dependencies: 290
-- Name: payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payments_id_seq', 1, false);


--
-- TOC entry 3851 (class 0 OID 0)
-- Dependencies: 288
-- Name: product_specs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_specs_id_seq', 1, false);


--
-- TOC entry 3852 (class 0 OID 0)
-- Dependencies: 286
-- Name: product_status_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_status_history_id_seq', 1, false);


--
-- TOC entry 3853 (class 0 OID 0)
-- Dependencies: 271
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 5, true);


--
-- TOC entry 3854 (class 0 OID 0)
-- Dependencies: 273
-- Name: sub_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sub_categories_id_seq', 12, true);


--
-- TOC entry 3855 (class 0 OID 0)
-- Dependencies: 275
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 6, true);


--
-- TOC entry 3553 (class 2606 OID 17484)
-- Name: auth_providers auth_providers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_providers
    ADD CONSTRAINT auth_providers_pkey PRIMARY KEY (id);


--
-- TOC entry 3557 (class 2606 OID 17486)
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);


--
-- TOC entry 3559 (class 2606 OID 17488)
-- Name: cart_items cart_items_user_id_product_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_user_id_product_id_key UNIQUE (user_id, product_id);


--
-- TOC entry 3562 (class 2606 OID 17490)
-- Name: categories categories_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key UNIQUE (name);


--
-- TOC entry 3564 (class 2606 OID 17492)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- TOC entry 3567 (class 2606 OID 17494)
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- TOC entry 3570 (class 2606 OID 17496)
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- TOC entry 3593 (class 2606 OID 25754)
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- TOC entry 3595 (class 2606 OID 25756)
-- Name: payments payments_transaction_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_transaction_id_key UNIQUE (transaction_id);


--
-- TOC entry 3591 (class 2606 OID 25715)
-- Name: product_specs product_specs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_specs
    ADD CONSTRAINT product_specs_pkey PRIMARY KEY (id);


--
-- TOC entry 3589 (class 2606 OID 18983)
-- Name: product_status_history product_status_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_status_history
    ADD CONSTRAINT product_status_history_pkey PRIMARY KEY (id);


--
-- TOC entry 3575 (class 2606 OID 17498)
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- TOC entry 3577 (class 2606 OID 17500)
-- Name: sub_categories sub_categories_name_category_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sub_categories
    ADD CONSTRAINT sub_categories_name_category_id_key UNIQUE (name, category_id);


--
-- TOC entry 3579 (class 2606 OID 17502)
-- Name: sub_categories sub_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sub_categories
    ADD CONSTRAINT sub_categories_pkey PRIMARY KEY (id);


--
-- TOC entry 3555 (class 2606 OID 17504)
-- Name: auth_providers uq_provider_user; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_providers
    ADD CONSTRAINT uq_provider_user UNIQUE (provider, provider_user_id);


--
-- TOC entry 3581 (class 2606 OID 17506)
-- Name: users users_cellphone_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cellphone_key UNIQUE (mobilephone);


--
-- TOC entry 3583 (class 2606 OID 17508)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 3585 (class 2606 OID 17510)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3587 (class 2606 OID 17512)
-- Name: users users_uuid_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_uuid_key UNIQUE (uuid);


--
-- TOC entry 3560 (class 1259 OID 17569)
-- Name: idx_cart_items_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cart_items_user_id ON public.cart_items USING btree (user_id);


--
-- TOC entry 3565 (class 1259 OID 17570)
-- Name: idx_order_items_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_order_items_order_id ON public.order_items USING btree (order_id);


--
-- TOC entry 3568 (class 1259 OID 17571)
-- Name: idx_orders_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_orders_user_id ON public.orders USING btree (user_id);


--
-- TOC entry 3571 (class 1259 OID 17572)
-- Name: idx_products_category_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_category_id ON public.products USING btree (category_id);


--
-- TOC entry 3572 (class 1259 OID 17573)
-- Name: idx_products_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_name ON public.products USING btree (name);


--
-- TOC entry 3573 (class 1259 OID 17574)
-- Name: idx_products_sub_category_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_sub_category_id ON public.products USING btree (sub_category_id);


--
-- TOC entry 3611 (class 2620 OID 25783)
-- Name: payments set_payments_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 3610 (class 2620 OID 25782)
-- Name: product_specs set_product_specs_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_product_specs_updated_at BEFORE UPDATE ON public.product_specs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 3609 (class 2620 OID 17582)
-- Name: users set_users_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 3608 (class 2620 OID 25831)
-- Name: orders update_orders_updated_at_column; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_orders_updated_at_column BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 3596 (class 2606 OID 17640)
-- Name: auth_providers auth_providers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_providers
    ADD CONSTRAINT auth_providers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3597 (class 2606 OID 17645)
-- Name: cart_items cart_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- TOC entry 3598 (class 2606 OID 17650)
-- Name: cart_items cart_items_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3599 (class 2606 OID 17655)
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- TOC entry 3600 (class 2606 OID 17660)
-- Name: order_items order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE RESTRICT;


--
-- TOC entry 3601 (class 2606 OID 17665)
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- TOC entry 3607 (class 2606 OID 25757)
-- Name: payments payments_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- TOC entry 3606 (class 2606 OID 25716)
-- Name: product_specs product_specs_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_specs
    ADD CONSTRAINT product_specs_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- TOC entry 3605 (class 2606 OID 18984)
-- Name: product_status_history product_status_history_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_status_history
    ADD CONSTRAINT product_status_history_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- TOC entry 3602 (class 2606 OID 17670)
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE RESTRICT;


--
-- TOC entry 3603 (class 2606 OID 17675)
-- Name: products products_sub_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_sub_category_id_fkey FOREIGN KEY (sub_category_id) REFERENCES public.sub_categories(id) ON DELETE RESTRICT;


--
-- TOC entry 3604 (class 2606 OID 17680)
-- Name: sub_categories sub_categories_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sub_categories
    ADD CONSTRAINT sub_categories_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- TOC entry 3768 (class 3256 OID 17705)
-- Name: auth_providers Enable read access for all users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for all users" ON public.auth_providers FOR SELECT USING (true);


--
-- TOC entry 3769 (class 3256 OID 18899)
-- Name: cart_items Enable read access for all users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for all users" ON public.cart_items FOR SELECT USING (true);


--
-- TOC entry 3770 (class 3256 OID 18900)
-- Name: categories Enable read access for all users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for all users" ON public.categories FOR SELECT USING (true);


--
-- TOC entry 3771 (class 3256 OID 18901)
-- Name: order_items Enable read access for all users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for all users" ON public.order_items FOR SELECT USING (true);


--
-- TOC entry 3772 (class 3256 OID 18902)
-- Name: orders Enable read access for all users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for all users" ON public.orders FOR SELECT USING (true);


--
-- TOC entry 3776 (class 3256 OID 25828)
-- Name: payments Enable read access for all users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for all users" ON public.payments FOR SELECT USING (true);


--
-- TOC entry 3777 (class 3256 OID 25829)
-- Name: product_specs Enable read access for all users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for all users" ON public.product_specs FOR SELECT USING (true);


--
-- TOC entry 3778 (class 3256 OID 25830)
-- Name: product_status_history Enable read access for all users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for all users" ON public.product_status_history FOR SELECT USING (true);


--
-- TOC entry 3773 (class 3256 OID 18903)
-- Name: products Enable read access for all users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for all users" ON public.products FOR SELECT USING (true);


--
-- TOC entry 3774 (class 3256 OID 18904)
-- Name: sub_categories Enable read access for all users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for all users" ON public.sub_categories FOR SELECT USING (true);


--
-- TOC entry 3775 (class 3256 OID 17706)
-- Name: users Enable read access for all users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for all users" ON public.users FOR SELECT USING (true);


--
-- TOC entry 3757 (class 0 OID 17320)
-- Dependencies: 260
-- Name: auth_providers; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.auth_providers ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 3758 (class 0 OID 17325)
-- Dependencies: 262
-- Name: cart_items; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 3759 (class 0 OID 17331)
-- Dependencies: 264
-- Name: categories; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 3760 (class 0 OID 17335)
-- Dependencies: 266
-- Name: order_items; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 3761 (class 0 OID 17341)
-- Dependencies: 268
-- Name: orders; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 3767 (class 0 OID 25743)
-- Dependencies: 291
-- Name: payments; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 3766 (class 0 OID 25703)
-- Dependencies: 289
-- Name: product_specs; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.product_specs ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 3765 (class 0 OID 18975)
-- Dependencies: 287
-- Name: product_status_history; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.product_status_history ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 3762 (class 0 OID 17350)
-- Dependencies: 270
-- Name: products; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 3763 (class 0 OID 17360)
-- Dependencies: 272
-- Name: sub_categories; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.sub_categories ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 3764 (class 0 OID 17364)
-- Dependencies: 274
-- Name: users; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 3808 (class 0 OID 0)
-- Dependencies: 3807
-- Name: DATABASE postgres; Type: ACL; Schema: -; Owner: postgres
--

GRANT ALL ON DATABASE postgres TO dashboard_user;


--
-- TOC entry 3810 (class 0 OID 0)
-- Dependencies: 20
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- TOC entry 3811 (class 0 OID 0)
-- Dependencies: 333
-- Name: FUNCTION update_updated_at_column(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.update_updated_at_column() TO anon;
GRANT ALL ON FUNCTION public.update_updated_at_column() TO authenticated;
GRANT ALL ON FUNCTION public.update_updated_at_column() TO service_role;


--
-- TOC entry 3812 (class 0 OID 0)
-- Dependencies: 260
-- Name: TABLE auth_providers; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.auth_providers TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.auth_providers TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.auth_providers TO service_role;


--
-- TOC entry 3814 (class 0 OID 0)
-- Dependencies: 261
-- Name: SEQUENCE auth_providers_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.auth_providers_id_seq TO anon;
GRANT ALL ON SEQUENCE public.auth_providers_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.auth_providers_id_seq TO service_role;


--
-- TOC entry 3815 (class 0 OID 0)
-- Dependencies: 262
-- Name: TABLE cart_items; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.cart_items TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.cart_items TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.cart_items TO service_role;


--
-- TOC entry 3817 (class 0 OID 0)
-- Dependencies: 263
-- Name: SEQUENCE cart_items_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.cart_items_id_seq TO anon;
GRANT ALL ON SEQUENCE public.cart_items_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.cart_items_id_seq TO service_role;


--
-- TOC entry 3818 (class 0 OID 0)
-- Dependencies: 264
-- Name: TABLE categories; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.categories TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.categories TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.categories TO service_role;


--
-- TOC entry 3820 (class 0 OID 0)
-- Dependencies: 265
-- Name: SEQUENCE categories_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.categories_id_seq TO anon;
GRANT ALL ON SEQUENCE public.categories_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.categories_id_seq TO service_role;


--
-- TOC entry 3821 (class 0 OID 0)
-- Dependencies: 266
-- Name: TABLE order_items; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.order_items TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.order_items TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.order_items TO service_role;


--
-- TOC entry 3823 (class 0 OID 0)
-- Dependencies: 267
-- Name: SEQUENCE order_items_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.order_items_id_seq TO anon;
GRANT ALL ON SEQUENCE public.order_items_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.order_items_id_seq TO service_role;


--
-- TOC entry 3824 (class 0 OID 0)
-- Dependencies: 268
-- Name: TABLE orders; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.orders TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.orders TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.orders TO service_role;


--
-- TOC entry 3826 (class 0 OID 0)
-- Dependencies: 269
-- Name: SEQUENCE orders_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.orders_id_seq TO anon;
GRANT ALL ON SEQUENCE public.orders_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.orders_id_seq TO service_role;


--
-- TOC entry 3827 (class 0 OID 0)
-- Dependencies: 291
-- Name: TABLE payments; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.payments TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.payments TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.payments TO service_role;


--
-- TOC entry 3829 (class 0 OID 0)
-- Dependencies: 290
-- Name: SEQUENCE payments_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.payments_id_seq TO anon;
GRANT ALL ON SEQUENCE public.payments_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.payments_id_seq TO service_role;


--
-- TOC entry 3830 (class 0 OID 0)
-- Dependencies: 289
-- Name: TABLE product_specs; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.product_specs TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.product_specs TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.product_specs TO service_role;


--
-- TOC entry 3832 (class 0 OID 0)
-- Dependencies: 288
-- Name: SEQUENCE product_specs_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.product_specs_id_seq TO anon;
GRANT ALL ON SEQUENCE public.product_specs_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.product_specs_id_seq TO service_role;


--
-- TOC entry 3833 (class 0 OID 0)
-- Dependencies: 287
-- Name: TABLE product_status_history; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.product_status_history TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.product_status_history TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.product_status_history TO service_role;


--
-- TOC entry 3835 (class 0 OID 0)
-- Dependencies: 286
-- Name: SEQUENCE product_status_history_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.product_status_history_id_seq TO anon;
GRANT ALL ON SEQUENCE public.product_status_history_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.product_status_history_id_seq TO service_role;


--
-- TOC entry 3836 (class 0 OID 0)
-- Dependencies: 270
-- Name: TABLE products; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.products TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.products TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.products TO service_role;


--
-- TOC entry 3838 (class 0 OID 0)
-- Dependencies: 271
-- Name: SEQUENCE products_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.products_id_seq TO anon;
GRANT ALL ON SEQUENCE public.products_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.products_id_seq TO service_role;


--
-- TOC entry 3839 (class 0 OID 0)
-- Dependencies: 272
-- Name: TABLE sub_categories; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.sub_categories TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.sub_categories TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.sub_categories TO service_role;


--
-- TOC entry 3841 (class 0 OID 0)
-- Dependencies: 273
-- Name: SEQUENCE sub_categories_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.sub_categories_id_seq TO anon;
GRANT ALL ON SEQUENCE public.sub_categories_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.sub_categories_id_seq TO service_role;


--
-- TOC entry 3842 (class 0 OID 0)
-- Dependencies: 274
-- Name: TABLE users; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.users TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.users TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.users TO service_role;


--
-- TOC entry 3844 (class 0 OID 0)
-- Dependencies: 275
-- Name: SEQUENCE users_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.users_id_seq TO anon;
GRANT ALL ON SEQUENCE public.users_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.users_id_seq TO service_role;


--
-- TOC entry 2326 (class 826 OID 17726)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- TOC entry 2329 (class 826 OID 17727)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- TOC entry 2331 (class 826 OID 17728)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- TOC entry 2332 (class 826 OID 17729)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- TOC entry 2333 (class 826 OID 17730)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO service_role;


--
-- TOC entry 2334 (class 826 OID 17731)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO service_role;


-- Completed on 2025-06-29 18:04:49

--
-- PostgreSQL database dump complete
--

