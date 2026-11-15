export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      account_snapshots: {
        Row: {
          context: Json
          created_at: string
          dataset_id: string | null
          id: string
          model_id: string | null
          user_id: string
        }
        Insert: {
          context?: Json
          created_at?: string
          dataset_id?: string | null
          id?: string
          model_id?: string | null
          user_id: string
        }
        Update: {
          context?: Json
          created_at?: string
          dataset_id?: string | null
          id?: string
          model_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "account_snapshots_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "dataset_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "account_snapshots_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "model_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          context: Json
          created_at: string
          dataset_id: string | null
          id: string
          model_id: string | null
          user_id: string
        }
        Insert: {
          context?: Json
          created_at?: string
          dataset_id?: string | null
          id?: string
          model_id?: string | null
          user_id: string
        }
        Update: {
          context?: Json
          created_at?: string
          dataset_id?: string | null
          id?: string
          model_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "dataset_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "model_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      broker_symbol_mappings: {
        Row: {
          context: Json
          created_at: string
          dataset_id: string | null
          id: string
          model_id: string | null
          user_id: string
        }
        Insert: {
          context?: Json
          created_at?: string
          dataset_id?: string | null
          id?: string
          model_id?: string | null
          user_id: string
        }
        Update: {
          context?: Json
          created_at?: string
          dataset_id?: string | null
          id?: string
          model_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "broker_symbol_mappings_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "dataset_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "broker_symbol_mappings_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "model_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      data_quality_checks: {
        Row: {
          context: Json
          created_at: string
          dataset_id: string | null
          id: string
          model_id: string | null
          user_id: string
        }
        Insert: {
          context?: Json
          created_at?: string
          dataset_id?: string | null
          id?: string
          model_id?: string | null
          user_id: string
        }
        Update: {
          context?: Json
          created_at?: string
          dataset_id?: string | null
          id?: string
          model_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "data_quality_checks_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "dataset_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "data_quality_checks_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "model_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      dataset_versions: {
        Row: {
          content_hash: string
          created_at: string
          end_at: string
          filename: string
          id: string
          provenance: string
          row_count: number
          start_at: string
          symbol: string
          timeframe: string
          user_id: string
        }
        Insert: {
          content_hash: string
          created_at?: string
          end_at: string
          filename: string
          id?: string
          provenance?: string
          row_count: number
          start_at: string
          symbol: string
          timeframe: string
          user_id: string
        }
        Update: {
          content_hash?: string
          created_at?: string
          end_at?: string
          filename?: string
          id?: string
          provenance?: string
          row_count?: number
          start_at?: string
          symbol?: string
          timeframe?: string
          user_id?: string
        }
        Relationships: []
      }
      executions: {
        Row: {
          context: Json
          created_at: string
          dataset_id: string | null
          id: string
          model_id: string | null
          user_id: string
        }
        Insert: {
          context?: Json
          created_at?: string
          dataset_id?: string | null
          id?: string
          model_id?: string | null
          user_id: string
        }
        Update: {
          context?: Json
          created_at?: string
          dataset_id?: string | null
          id?: string
          model_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "executions_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "dataset_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "executions_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "model_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      indicator_exports: {
        Row: {
          context: Json
          created_at: string
          dataset_id: string | null
          id: string
          model_id: string | null
          user_id: string
        }
        Insert: {
          context?: Json
          created_at?: string
          dataset_id?: string | null
          id?: string
          model_id?: string | null
          user_id: string
        }
        Update: {
          context?: Json
          created_at?: string
          dataset_id?: string | null
          id?: string
          model_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "indicator_exports_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "dataset_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "indicator_exports_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "model_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      instruments: {
        Row: {
          asset_class: string
          id: string
          name: string
          symbol: string
        }
        Insert: {
          asset_class: string
          id?: string
          name: string
          symbol: string
        }
        Update: {
          asset_class?: string
          id?: string
          name?: string
          symbol?: string
        }
        Relationships: []
      }
      market_bars: {
        Row: {
          close: number
          dataset_id: string
          high: number
          id: string
          low: number
          open: number
          symbol: string
          timeframe: string
          timestamp: string
          user_id: string
          volume: number | null
        }
        Insert: {
          close: number
          dataset_id: string
          high: number
          id?: string
          low: number
          open: number
          symbol: string
          timeframe: string
          timestamp: string
          user_id: string
          volume?: number | null
        }
        Update: {
          close?: number
          dataset_id?: string
          high?: number
          id?: string
          low?: number
          open?: number
          symbol?: string
          timeframe?: string
          timestamp?: string
          user_id?: string
          volume?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "market_bars_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "dataset_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      market_data_sources: {
        Row: {
          context: Json
          created_at: string
          dataset_id: string | null
          id: string
          model_id: string | null
          user_id: string
        }
        Insert: {
          context?: Json
          created_at?: string
          dataset_id?: string | null
          id?: string
          model_id?: string | null
          user_id: string
        }
        Update: {
          context?: Json
          created_at?: string
          dataset_id?: string | null
          id?: string
          model_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "market_data_sources_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "dataset_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "market_data_sources_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "model_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      market_features: {
        Row: {
          context: Json
          created_at: string
          dataset_id: string | null
          id: string
          model_id: string | null
          user_id: string
        }
        Insert: {
          context?: Json
          created_at?: string
          dataset_id?: string | null
          id?: string
          model_id?: string | null
          user_id: string
        }
        Update: {
          context?: Json
          created_at?: string
          dataset_id?: string | null
          id?: string
          model_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "market_features_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "dataset_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "market_features_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "model_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      market_regimes: {
        Row: {
          context: Json
          created_at: string
          dataset_id: string | null
          id: string
          model_id: string | null
          user_id: string
        }
        Insert: {
          context?: Json
          created_at?: string
          dataset_id?: string | null
          id?: string
          model_id?: string | null
          user_id: string
        }
        Update: {
          context?: Json
          created_at?: string
          dataset_id?: string | null
          id?: string
          model_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "market_regimes_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "dataset_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "market_regimes_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "model_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      market_ticks: {
        Row: {
          context: Json
          created_at: string
          dataset_id: string | null
          id: string
          model_id: string | null
          user_id: string
        }
        Insert: {
          context?: Json
          created_at?: string
          dataset_id?: string | null
          id?: string
          model_id?: string | null
          user_id: string
        }
        Update: {
          context?: Json
          created_at?: string
          dataset_id?: string | null
          id?: string
          model_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "market_ticks_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "dataset_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "market_ticks_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "model_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      model_evaluations: {
        Row: {
          context: Json
          created_at: string
          dataset_id: string | null
          id: string
          model_id: string | null
          user_id: string
        }
        Insert: {
          context?: Json
          created_at?: string
          dataset_id?: string | null
          id?: string
          model_id?: string | null
          user_id: string
        }
        Update: {
          context?: Json
          created_at?: string
          dataset_id?: string | null
          id?: string
          model_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "model_evaluations_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "dataset_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "model_evaluations_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "model_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      model_health: {
        Row: {
          context: Json
          created_at: string
          dataset_id: string | null
          id: string
          model_id: string | null
          user_id: string
        }
        Insert: {
          context?: Json
          created_at?: string
          dataset_id?: string | null
          id?: string
          model_id?: string | null
          user_id: string
        }
        Update: {
          context?: Json
          created_at?: string
          dataset_id?: string | null
          id?: string
          model_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "model_health_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "dataset_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "model_health_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "model_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      model_predictions: {
        Row: {
          bearish: number
          bullish: number
          decision: string
          expires_at: string
          feature_context: Json
          generated_at: string
          id: string
          model_id: string
          neutral: number
          regime: string
          symbol: string
          timeframe: string
          user_id: string
        }
        Insert: {
          bearish: number
          bullish: number
          decision: string
          expires_at: string
          feature_context: Json
          generated_at: string
          id?: string
          model_id: string
          neutral: number
          regime: string
          symbol: string
          timeframe: string
          user_id: string
        }
        Update: {
          bearish?: number
          bullish?: number
          decision?: string
          expires_at?: string
          feature_context?: Json
          generated_at?: string
          id?: string
          model_id?: string
          neutral?: number
          regime?: string
          symbol?: string
          timeframe?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "model_predictions_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "model_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      model_versions: {
        Row: {
          created_at: string
          dataset_id: string | null
          id: string
          metrics: Json
          status: string
          user_id: string
          version: string
        }
        Insert: {
          created_at?: string
          dataset_id?: string | null
          id?: string
          metrics?: Json
          status?: string
          user_id: string
          version: string
        }
        Update: {
          created_at?: string
          dataset_id?: string | null
          id?: string
          metrics?: Json
          status?: string
          user_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "model_versions_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "dataset_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          context: Json
          created_at: string
          dataset_id: string | null
          id: string
          model_id: string | null
          user_id: string
        }
        Insert: {
          context?: Json
          created_at?: string
          dataset_id?: string | null
          id?: string
          model_id?: string | null
          user_id: string
        }
        Update: {
          context?: Json
          created_at?: string
          dataset_id?: string | null
          id?: string
          model_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "dataset_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "model_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      pattern_events: {
        Row: {
          context: Json
          created_at: string
          dataset_id: string | null
          id: string
          model_id: string | null
          user_id: string
        }
        Insert: {
          context?: Json
          created_at?: string
          dataset_id?: string | null
          id?: string
          model_id?: string | null
          user_id: string
        }
        Update: {
          context?: Json
          created_at?: string
          dataset_id?: string | null
          id?: string
          model_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pattern_events_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "dataset_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pattern_events_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "model_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      positions: {
        Row: {
          context: Json
          created_at: string
          dataset_id: string | null
          id: string
          model_id: string | null
          user_id: string
        }
        Insert: {
          context?: Json
          created_at?: string
          dataset_id?: string | null
          id?: string
          model_id?: string | null
          user_id: string
        }
        Update: {
          context?: Json
          created_at?: string
          dataset_id?: string | null
          id?: string
          model_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "positions_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "dataset_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "positions_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "model_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      prediction_outcomes: {
        Row: {
          context: Json
          created_at: string
          dataset_id: string | null
          id: string
          model_id: string | null
          user_id: string
        }
        Insert: {
          context?: Json
          created_at?: string
          dataset_id?: string | null
          id?: string
          model_id?: string | null
          user_id: string
        }
        Update: {
          context?: Json
          created_at?: string
          dataset_id?: string | null
          id?: string
          model_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prediction_outcomes_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "dataset_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prediction_outcomes_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "model_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      risk_events: {
        Row: {
          context: Json
          created_at: string
          dataset_id: string | null
          id: string
          model_id: string | null
          user_id: string
        }
        Insert: {
          context?: Json
          created_at?: string
          dataset_id?: string | null
          id?: string
          model_id?: string | null
          user_id: string
        }
        Update: {
          context?: Json
          created_at?: string
          dataset_id?: string | null
          id?: string
          model_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "risk_events_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "dataset_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risk_events_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "model_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      signal_records: {
        Row: {
          context: Json
          created_at: string
          dataset_id: string | null
          id: string
          model_id: string | null
          user_id: string
        }
        Insert: {
          context?: Json
          created_at?: string
          dataset_id?: string | null
          id?: string
          model_id?: string | null
          user_id: string
        }
        Update: {
          context?: Json
          created_at?: string
          dataset_id?: string | null
          id?: string
          model_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "signal_records_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "dataset_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "signal_records_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "model_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      simulator_test_results: {
        Row: {
          context: Json
          created_at: string
          dataset_id: string | null
          id: string
          model_id: string | null
          user_id: string
        }
        Insert: {
          context?: Json
          created_at?: string
          dataset_id?: string | null
          id?: string
          model_id?: string | null
          user_id: string
        }
        Update: {
          context?: Json
          created_at?: string
          dataset_id?: string | null
          id?: string
          model_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "simulator_test_results_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "dataset_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "simulator_test_results_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "model_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      simulator_test_runs: {
        Row: {
          context: Json
          created_at: string
          dataset_id: string | null
          id: string
          model_id: string | null
          user_id: string
        }
        Insert: {
          context?: Json
          created_at?: string
          dataset_id?: string | null
          id?: string
          model_id?: string | null
          user_id: string
        }
        Update: {
          context?: Json
          created_at?: string
          dataset_id?: string | null
          id?: string
          model_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "simulator_test_runs_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "dataset_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "simulator_test_runs_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "model_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      strategy_definitions: {
        Row: {
          context: Json
          created_at: string
          dataset_id: string | null
          id: string
          model_id: string | null
          user_id: string
        }
        Insert: {
          context?: Json
          created_at?: string
          dataset_id?: string | null
          id?: string
          model_id?: string | null
          user_id: string
        }
        Update: {
          context?: Json
          created_at?: string
          dataset_id?: string | null
          id?: string
          model_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "strategy_definitions_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "dataset_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "strategy_definitions_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "model_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      strategy_regime_performance: {
        Row: {
          context: Json
          created_at: string
          dataset_id: string | null
          id: string
          model_id: string | null
          user_id: string
        }
        Insert: {
          context?: Json
          created_at?: string
          dataset_id?: string | null
          id?: string
          model_id?: string | null
          user_id: string
        }
        Update: {
          context?: Json
          created_at?: string
          dataset_id?: string | null
          id?: string
          model_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "strategy_regime_performance_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "dataset_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "strategy_regime_performance_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "model_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      system_events: {
        Row: {
          context: Json
          created_at: string
          dataset_id: string | null
          id: string
          model_id: string | null
          user_id: string
        }
        Insert: {
          context?: Json
          created_at?: string
          dataset_id?: string | null
          id?: string
          model_id?: string | null
          user_id: string
        }
        Update: {
          context?: Json
          created_at?: string
          dataset_id?: string | null
          id?: string
          model_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "system_events_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "dataset_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "system_events_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "model_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      trade_intents: {
        Row: {
          context: Json
          created_at: string
          dataset_id: string | null
          id: string
          model_id: string | null
          user_id: string
        }
        Insert: {
          context?: Json
          created_at?: string
          dataset_id?: string | null
          id?: string
          model_id?: string | null
          user_id: string
        }
        Update: {
          context?: Json
          created_at?: string
          dataset_id?: string | null
          id?: string
          model_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trade_intents_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "dataset_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trade_intents_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "model_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      training_runs: {
        Row: {
          context: Json
          created_at: string
          dataset_id: string | null
          id: string
          model_id: string | null
          user_id: string
        }
        Insert: {
          context?: Json
          created_at?: string
          dataset_id?: string | null
          id?: string
          model_id?: string | null
          user_id: string
        }
        Update: {
          context?: Json
          created_at?: string
          dataset_id?: string | null
          id?: string
          model_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_runs_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "dataset_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_runs_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "model_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          default_timeframe: string
          id: string
          risk_per_trade: number
          timezone: string
          updated_at: string
          user_id: string
        }
        Insert: {
          default_timeframe?: string
          id?: string
          risk_per_trade?: number
          timezone?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          default_timeframe?: string
          id?: string
          risk_per_trade?: number
          timezone?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      import_historical_dataset: {
        Args: {
          p_bars: Json
          p_filename: string
          p_hash: string
          p_symbol: string
          p_timeframe: string
        }
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "researcher" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "researcher", "user"],
    },
  },
} as const
