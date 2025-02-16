ALTER TABLE `financial_account` ADD `type` text DEFAULT 'payment' NOT NULL;--> statement-breakpoint
ALTER TABLE `financial_account` ADD `archived` integer DEFAULT false;