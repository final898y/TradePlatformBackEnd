export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      auth_providers: {
        Row: {
          created_at: string | null;
          id: number;
          provider: string;
          provider_user_id: string;
          user_id: number;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          provider: string;
          provider_user_id: string;
          user_id: number;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          provider?: string;
          provider_user_id?: string;
          user_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'auth_providers_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      cart_items: {
        Row: {
          added_at: string | null;
          id: number;
          product_id: number;
          quantity: number;
          user_id: number;
        };
        Insert: {
          added_at?: string | null;
          id?: number;
          product_id: number;
          quantity: number;
          user_id: number;
        };
        Update: {
          added_at?: string | null;
          id?: number;
          product_id?: number;
          quantity?: number;
          user_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'cart_items_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'cart_items_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      categories: {
        Row: {
          id: number;
          name: string;
        };
        Insert: {
          id?: number;
          name: string;
        };
        Update: {
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          id: number;
          order_id: number;
          product_id: number;
          quantity: number;
          unit_price: number;
        };
        Insert: {
          id?: number;
          order_id: number;
          product_id: number;
          quantity: number;
          unit_price: number;
        };
        Update: {
          id?: number;
          order_id?: number;
          product_id?: number;
          quantity?: number;
          unit_price?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'order_items_order_id_fkey';
            columns: ['order_id'];
            isOneToOne: false;
            referencedRelation: 'orders';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'order_items_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          },
        ];
      };
      orders: {
        Row: {
          created_at: string | null;
          id: number;
          order_note: string | null;
          order_number: string;
          paid_at: string | null;
          payment_method: string;
          recipient_email: string;
          recipient_name: string;
          recipient_phone: string;
          shipping_address: string;
          status: string;
          total_amount: number;
          updated_at: string | null;
          user_id: number;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          order_note?: string | null;
          order_number: string;
          paid_at?: string | null;
          payment_method: string;
          recipient_email: string;
          recipient_name: string;
          recipient_phone: string;
          shipping_address: string;
          status: string;
          total_amount: number;
          updated_at?: string | null;
          user_id: number;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          order_note?: string | null;
          order_number?: string;
          paid_at?: string | null;
          payment_method?: string;
          recipient_email?: string;
          recipient_name?: string;
          recipient_phone?: string;
          shipping_address?: string;
          status?: string;
          total_amount?: number;
          updated_at?: string | null;
          user_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'orders_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      payments: {
        Row: {
          amount: number;
          created_at: string | null;
          id: number;
          order_id: number | null;
          paid_at: string | null;
          payment_method: string;
          status: string;
          transaction_id: string;
          updated_at: string | null;
        };
        Insert: {
          amount: number;
          created_at?: string | null;
          id?: number;
          order_id?: number | null;
          paid_at?: string | null;
          payment_method: string;
          status: string;
          transaction_id: string;
          updated_at?: string | null;
        };
        Update: {
          amount?: number;
          created_at?: string | null;
          id?: number;
          order_id?: number | null;
          paid_at?: string | null;
          payment_method?: string;
          status?: string;
          transaction_id?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'payments_order_id_fkey';
            columns: ['order_id'];
            isOneToOne: false;
            referencedRelation: 'orders';
            referencedColumns: ['id'];
          },
        ];
      };
      product_specs: {
        Row: {
          created_at: string | null;
          extra_price: number | null;
          id: number;
          product_id: number | null;
          spec_name: string;
          spec_value: string;
          stock: number | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          extra_price?: number | null;
          id?: number;
          product_id?: number | null;
          spec_name: string;
          spec_value: string;
          stock?: number | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          extra_price?: number | null;
          id?: number;
          product_id?: number | null;
          spec_name?: string;
          spec_value?: string;
          stock?: number | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'product_specs_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          },
        ];
      };
      product_status_history: {
        Row: {
          id: number;
          operated_at: string | null;
          operated_by: string | null;
          product_id: number;
          reason: string | null;
          status: string;
        };
        Insert: {
          id?: number;
          operated_at?: string | null;
          operated_by?: string | null;
          product_id: number;
          reason?: string | null;
          status: string;
        };
        Update: {
          id?: number;
          operated_at?: string | null;
          operated_by?: string | null;
          product_id?: number;
          reason?: string | null;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'product_status_history_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          },
        ];
      };
      products: {
        Row: {
          category_id: number;
          created_at: string | null;
          description: string | null;
          id: number;
          image_url: string | null;
          is_deleted: boolean;
          is_published: boolean;
          name: string;
          price: number;
          publish_at: string | null;
          stock: number;
          sub_category_id: number;
          unpublish_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          category_id: number;
          created_at?: string | null;
          description?: string | null;
          id?: number;
          image_url?: string | null;
          is_deleted?: boolean;
          is_published?: boolean;
          name: string;
          price: number;
          publish_at?: string | null;
          stock: number;
          sub_category_id: number;
          unpublish_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          category_id?: number;
          created_at?: string | null;
          description?: string | null;
          id?: number;
          image_url?: string | null;
          is_deleted?: boolean;
          is_published?: boolean;
          name?: string;
          price?: number;
          publish_at?: string | null;
          stock?: number;
          sub_category_id?: number;
          unpublish_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'products_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'products_sub_category_id_fkey';
            columns: ['sub_category_id'];
            isOneToOne: false;
            referencedRelation: 'sub_categories';
            referencedColumns: ['id'];
          },
        ];
      };
      sub_categories: {
        Row: {
          category_id: number;
          id: number;
          name: string;
        };
        Insert: {
          category_id: number;
          id?: number;
          name: string;
        };
        Update: {
          category_id?: number;
          id?: number;
          name?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'sub_categories_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          },
        ];
      };
      users: {
        Row: {
          created_at: string | null;
          email: string | null;
          id: number;
          mobilephone: string;
          name: string | null;
          password_hash: string | null;
          updated_at: string | null;
          uuid: string;
        };
        Insert: {
          created_at?: string | null;
          email?: string | null;
          id?: number;
          mobilephone?: string;
          name?: string | null;
          password_hash?: string | null;
          updated_at?: string | null;
          uuid: string;
        };
        Update: {
          created_at?: string | null;
          email?: string | null;
          id?: number;
          mobilephone?: string;
          name?: string | null;
          password_hash?: string | null;
          updated_at?: string | null;
          uuid?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums'] | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const;
