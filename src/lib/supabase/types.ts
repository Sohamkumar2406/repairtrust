export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "customer" | "technician" | "admin";
export type AccountStatus = "active" | "suspended" | "pending_verification" | "deactivated";
export type VerificationStatus = "pending" | "verified" | "rejected" | "under_review";
export type RequestStatus =
  | "draft"
  | "open"
  | "quoted"
  | "booked"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "expired";
export type QuoteStatus = "pending" | "accepted" | "rejected" | "expired" | "withdrawn";
export type BookingStatus =
  | "confirmed"
  | "technician_en_route"
  | "arrived"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "disputed";
export type PaymentStatus = "pending" | "authorized" | "captured" | "failed" | "refunded";
export type PayoutStatus = "pending" | "processing" | "settled" | "failed";
export type RefundStatus = "initiated" | "processed" | "failed";
export type WarrantyStatus = "active" | "claimed" | "expired" | "void";
export type DisputeStatus = "opened" | "investigating" | "resolved" | "dismissed";
export type MediaType = "image" | "video" | "audio" | "document";
export type DocumentType =
  | "aadhaar"
  | "driving_license"
  | "pan_card"
  | "trade_certificate"
  | "police_clearance"
  | "workshop_license";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          phone: string;
          email: string | null;
          avatar_url: string | null;
          role: UserRole;
          account_status: AccountStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          phone: string;
          email?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          account_status?: AccountStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          phone?: string;
          email?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          account_status?: AccountStatus;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      customer_addresses: {
        Row: {
          id: string;
          customer_id: string;
          address_line: string;
          area: string;
          city: string;
          state: string;
          pincode: string;
          latitude: number | null;
          longitude: number | null;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          address_line: string;
          area: string;
          city?: string;
          state?: string;
          pincode: string;
          latitude?: number | null;
          longitude?: number | null;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          address_line?: string;
          area?: string;
          city?: string;
          state?: string;
          pincode?: string;
          latitude?: number | null;
          longitude?: number | null;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      technician_profiles: {
        Row: {
          id: string;
          user_id: string;
          business_name: string | null;
          experience_years: number;
          bio: string | null;
          verification_status: VerificationStatus;
          service_radius_km: number;
          average_rating: number;
          total_jobs: number;
          availability_status: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          business_name?: string | null;
          experience_years?: number;
          bio?: string | null;
          verification_status?: VerificationStatus;
          service_radius_km?: number;
          average_rating?: number;
          total_jobs?: number;
          availability_status?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          business_name?: string | null;
          experience_years?: number;
          bio?: string | null;
          verification_status?: VerificationStatus;
          service_radius_km?: number;
          average_rating?: number;
          total_jobs?: number;
          availability_status?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      technician_documents: {
        Row: {
          id: string;
          technician_id: string;
          document_type: DocumentType;
          storage_path: string;
          verification_status: VerificationStatus;
          rejection_reason: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          technician_id: string;
          document_type: DocumentType;
          storage_path: string;
          verification_status?: VerificationStatus;
          rejection_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          technician_id?: string;
          document_type?: DocumentType;
          storage_path?: string;
          verification_status?: VerificationStatus;
          rejection_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      service_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string;
          icon: string;
          image_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description: string;
          icon: string;
          image_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string;
          icon?: string;
          image_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      technician_services: {
        Row: {
          id: string;
          technician_id: string;
          category_id: string;
          starting_price: number;
          experience_years: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          technician_id: string;
          category_id: string;
          starting_price: number;
          experience_years: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          technician_id?: string;
          category_id?: string;
          starting_price?: number;
          experience_years?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };

      service_requests: {
        Row: {
          id: string;
          customer_id: string;
          category_id: string;
          address_id: string;
          title: string;
          description: string;
          problem_details: Json;
          preferred_date: string;
          preferred_time: string;
          request_status: RequestStatus;
          latitude: number | null;
          longitude: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          category_id: string;
          address_id: string;
          title: string;
          description: string;
          problem_details?: Json;
          preferred_date: string;
          preferred_time: string;
          request_status?: RequestStatus;
          latitude?: number | null;
          longitude?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          category_id?: string;
          address_id?: string;
          title?: string;
          description?: string;
          problem_details?: Json;
          preferred_date?: string;
          preferred_time?: string;
          request_status?: RequestStatus;
          latitude?: number | null;
          longitude?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      request_media: {
        Row: {
          id: string;
          request_id: string;
          storage_path: string;
          media_type: MediaType;
          created_at: string;
        };
        Insert: {
          id?: string;
          request_id: string;
          storage_path: string;
          media_type: MediaType;
          created_at?: string;
        };
        Update: {
          id?: string;
          request_id?: string;
          storage_path?: string;
          media_type?: MediaType;
          created_at?: string;
        };
        Relationships: [];
      };

      quotes: {
        Row: {
          id: string;
          request_id: string;
          technician_id: string;
          labour_cost: number;
          parts_cost: number;
          inspection_cost: number;
          tax_amount: number;
          additional_charges: number;
          total_amount: number;
          estimated_completion_time: string;
          quote_status: QuoteStatus;
          validity_date: string;
          terms: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          request_id: string;
          technician_id: string;
          labour_cost: number;
          parts_cost?: number;
          inspection_cost?: number;
          tax_amount?: number;
          additional_charges?: number;
          total_amount: number;
          estimated_completion_time: string;
          quote_status?: QuoteStatus;
          validity_date: string;
          terms?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          request_id?: string;
          technician_id?: string;
          labour_cost?: number;
          parts_cost?: number;
          inspection_cost?: number;
          tax_amount?: number;
          additional_charges?: number;
          total_amount?: number;
          estimated_completion_time?: string;
          quote_status?: QuoteStatus;
          validity_date?: string;
          terms?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      quote_items: {
        Row: {
          id: string;
          quote_id: string;
          item_name: string;
          description: string | null;
          quantity: number;
          unit_price: number;
          total_price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          quote_id: string;
          item_name: string;
          description?: string | null;
          quantity?: number;
          unit_price: number;
          total_price: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          quote_id?: string;
          item_name?: string;
          description?: string | null;
          quantity?: number;
          unit_price?: number;
          total_price?: number;
          created_at?: string;
        };
        Relationships: [];
      };

      bookings: {
        Row: {
          id: string;
          request_id: string;
          quote_id: string;
          customer_id: string;
          technician_id: string;
          scheduled_at: string;
          booking_status: BookingStatus;
          final_amount: number;
          completion_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          request_id: string;
          quote_id: string;
          customer_id: string;
          technician_id: string;
          scheduled_at: string;
          booking_status?: BookingStatus;
          final_amount: number;
          completion_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          request_id?: string;
          quote_id?: string;
          customer_id?: string;
          technician_id?: string;
          scheduled_at?: string;
          booking_status?: BookingStatus;
          final_amount?: number;
          completion_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      booking_status_history: {
        Row: {
          id: string;
          booking_id: string;
          old_status: BookingStatus | null;
          new_status: BookingStatus;
          changed_by: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          old_status?: BookingStatus | null;
          new_status: BookingStatus;
          changed_by: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          booking_id?: string;
          old_status?: BookingStatus | null;
          new_status?: BookingStatus;
          changed_by?: string;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };

      payments: {
        Row: {
          id: string;
          booking_id: string;
          customer_id: string;
          amount: number;
          currency: string;
          payment_method: string;
          payment_gateway: string;
          gateway_order_id: string | null;
          gateway_payment_id: string | null;
          payment_status: PaymentStatus;
          paid_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          customer_id: string;
          amount: number;
          currency?: string;
          payment_method: string;
          payment_gateway: string;
          gateway_order_id?: string | null;
          gateway_payment_id?: string | null;
          payment_status?: PaymentStatus;
          paid_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          booking_id?: string;
          customer_id?: string;
          amount?: number;
          currency?: string;
          payment_method?: string;
          payment_gateway?: string;
          gateway_order_id?: string | null;
          gateway_payment_id?: string | null;
          payment_status?: PaymentStatus;
          paid_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      platform_commissions: {
        Row: {
          id: string;
          booking_id: string;
          technician_id: string;
          commission_percentage: number;
          commission_amount: number;
          technician_payout: number;
          payout_status: PayoutStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          technician_id: string;
          commission_percentage: number;
          commission_amount: number;
          technician_payout: number;
          payout_status?: PayoutStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          booking_id?: string;
          technician_id?: string;
          commission_percentage?: number;
          commission_amount?: number;
          technician_payout?: number;
          payout_status?: PayoutStatus;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      refunds: {
        Row: {
          id: string;
          payment_id: string;
          amount: number;
          reason: string;
          refund_status: RefundStatus;
          gateway_refund_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          payment_id: string;
          amount: number;
          reason: string;
          refund_status?: RefundStatus;
          gateway_refund_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          payment_id?: string;
          amount?: number;
          reason?: string;
          refund_status?: RefundStatus;
          gateway_refund_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      warranties: {
        Row: {
          id: string;
          booking_id: string;
          customer_id: string;
          technician_id: string;
          warranty_period_days: number;
          warranty_start_date: string;
          warranty_end_date: string;
          warranty_terms: string;
          warranty_status: WarrantyStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          customer_id: string;
          technician_id: string;
          warranty_period_days: number;
          warranty_start_date: string;
          warranty_end_date: string;
          warranty_terms: string;
          warranty_status?: WarrantyStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          booking_id?: string;
          customer_id?: string;
          technician_id?: string;
          warranty_period_days?: number;
          warranty_start_date?: string;
          warranty_end_date?: string;
          warranty_terms?: string;
          warranty_status?: WarrantyStatus;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      reviews: {
        Row: {
          id: string;
          booking_id: string;
          customer_id: string;
          technician_id: string;
          rating: number;
          review_text: string | null;
          is_verified_booking: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          customer_id: string;
          technician_id: string;
          rating: number;
          review_text?: string | null;
          is_verified_booking?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          booking_id?: string;
          customer_id?: string;
          technician_id?: string;
          rating?: number;
          review_text?: string | null;
          is_verified_booking?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      conversations: {
        Row: {
          id: string;
          booking_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          booking_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };

      conversation_participants: {
        Row: {
          id: string;
          conversation_id: string;
          user_id: string;
          last_read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          user_id: string;
          last_read_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          user_id?: string;
          last_read_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };

      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          message_text: string;
          attachment_path: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          sender_id: string;
          message_text: string;
          attachment_path?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          sender_id?: string;
          message_text?: string;
          attachment_path?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };

      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          notification_type: string;
          is_read: boolean;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          message: string;
          notification_type: string;
          is_read?: boolean;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          message?: string;
          notification_type?: string;
          is_read?: boolean;
          metadata?: Json | null;
          created_at?: string;
        };
        Relationships: [];
      };

      disputes: {
        Row: {
          id: string;
          booking_id: string;
          customer_id: string;
          technician_id: string;
          issue_type: string;
          description: string;
          dispute_status: DisputeStatus;
          resolution_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          customer_id: string;
          technician_id: string;
          issue_type: string;
          description: string;
          dispute_status?: DisputeStatus;
          resolution_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          booking_id?: string;
          customer_id?: string;
          technician_id?: string;
          issue_type?: string;
          description?: string;
          dispute_status?: DisputeStatus;
          resolution_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      dispute_messages: {
        Row: {
          id: string;
          dispute_id: string;
          sender_id: string;
          message_text: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          dispute_id: string;
          sender_id: string;
          message_text: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          dispute_id?: string;
          sender_id?: string;
          message_text?: string;
          created_at?: string;
        };
        Relationships: [];
      };

      coupons: {
        Row: {
          id: string;
          code: string;
          discount_type: "percentage" | "fixed_amount";
          discount_value: number;
          minimum_order_value: number;
          maximum_discount: number | null;
          usage_limit: number | null;
          used_count: number;
          expiry_date: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          discount_type: "percentage" | "fixed_amount";
          discount_value: number;
          minimum_order_value?: number;
          maximum_discount?: number | null;
          usage_limit?: number | null;
          used_count?: number;
          expiry_date: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          discount_type?: "percentage" | "fixed_amount";
          discount_value?: number;
          minimum_order_value?: number;
          maximum_discount?: number | null;
          usage_limit?: number | null;
          used_count?: number;
          expiry_date?: string;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };

      coupon_redemptions: {
        Row: {
          id: string;
          coupon_id: string;
          customer_id: string;
          booking_id: string;
          discount_applied: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          coupon_id: string;
          customer_id: string;
          booking_id: string;
          discount_applied: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          coupon_id?: string;
          customer_id?: string;
          booking_id?: string;
          discount_applied?: number;
          created_at?: string;
        };
        Relationships: [];
      };

      audit_logs: {
        Row: {
          id: string;
          actor_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_id?: string | null;
          action: string;
          entity_type: string;
          entity_id: string;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          actor_id?: string | null;
          action?: string;
          entity_type?: string;
          entity_id?: string;
          metadata?: Json | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      is_assigned_technician: {
        Args: {
          booking_uuid: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      user_role: UserRole;
      account_status: AccountStatus;
      verification_status: VerificationStatus;
      request_status: RequestStatus;
      quote_status: QuoteStatus;
      booking_status: BookingStatus;
      payment_status: PaymentStatus;
      payout_status: PayoutStatus;
      refund_status: RefundStatus;
      warranty_status: WarrantyStatus;
      dispute_status: DisputeStatus;
      media_type: MediaType;
      document_type: DocumentType;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
