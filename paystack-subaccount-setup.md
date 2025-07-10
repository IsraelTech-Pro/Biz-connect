# Paystack Subaccount Setup Guide

## Overview
To enable direct vendor payments, you need to create Paystack subaccounts for each vendor. This allows payments to go directly to their bank accounts instead of your platform account.

## Step 1: Create Subaccounts in Paystack Dashboard

1. **Login to Paystack Dashboard**
   - Go to [dashboard.paystack.com](https://dashboard.paystack.com)
   - Login with your Paystack credentials

2. **Navigate to Subaccounts**
   - Go to **Customers** → **Subaccounts** in the sidebar
   - Click **Create Subaccount**

3. **Fill Subaccount Details**
   For each vendor, create a subaccount with:
   - **Business Name**: Vendor's business name
   - **Settlement Bank**: Vendor's bank
   - **Account Number**: Vendor's account number
   - **Percentage Charge**: Your platform fee (e.g., 5%)
   - **Primary Contact Email**: Vendor's email
   - **Primary Contact Phone**: Vendor's phone number

4. **Get Subaccount Code**
   - After creation, you'll get a subaccount code like `ACCT_xxxxxxxxx`
   - Copy this code for the next step

## Step 2: Update Database with Subaccount Codes

Run this SQL for each vendor:

```sql
-- Update vendor with their Paystack subaccount code
UPDATE users 
SET paystack_subaccount = 'ACCT_xxxxxxxxx' 
WHERE id = 'vendor-uuid-here' AND role = 'vendor';
```

## Step 3: Verify Setup

1. **Check Subaccount Status**
   - Ensure subaccount is **Active** in Paystack dashboard
   - Verify bank details are correct

2. **Test Payment Flow**
   - Make a test payment through your app
   - Check that payment goes to vendor's account
   - Verify platform fee is deducted correctly

## Payment Flow After Setup

1. **Buyer initiates payment** → Order created in database
2. **Payment initialized** with vendor's subaccount code
3. **Payment processed** → Money goes directly to vendor's bank
4. **Platform fee deducted** automatically by Paystack
5. **Callback handled** → User redirected back to app
6. **Payment status saved** in database

## Important Notes

- **Subaccount Verification**: Paystack may require additional verification for subaccounts
- **Settlement**: Payments settle to vendor accounts within 2-3 business days
- **Fees**: Platform fees are automatically deducted before settlement
- **Monitoring**: Track all transactions in Paystack dashboard

## SQL to Check Current Setup

```sql
-- Check which vendors have subaccounts configured
SELECT 
    id,
    business_name,
    email,
    paystack_subaccount,
    CASE 
        WHEN paystack_subaccount IS NULL THEN 'Not Configured'
        ELSE 'Configured'
    END as subaccount_status
FROM users 
WHERE role = 'vendor';
```

## Example Subaccount Configuration

```sql
-- Example for a vendor
UPDATE users 
SET paystack_subaccount = 'ACCT_abc123def456' 
WHERE email = 'vendor@example.com' AND role = 'vendor';
```

Once all vendors have subaccounts configured, the direct payment system will work perfectly!