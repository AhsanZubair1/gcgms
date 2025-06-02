/**
 * Enum for error message translation keys
 */
export enum ErrorKey {
  // Basic errors
  ALREADY_EXISTS = 'error-messages.already_exists',
  INCORRECT = 'error-messages.incorrect',
  INCORRECT_CREDENTIAL = 'error-messages.incorrect_credential',
  INCORRECT_EMAIL = 'error-messages.incorrect_email',
  NOT_PRESENT = 'error-messages.not_present',
  NOT_FOUND = 'error-messages.not_found',
  NOT_FOUND_WITHOUT_VALUE = 'error-messages.not_found_without_value',
  INVALID_SESSION = 'error-messages.invalid_session',
  USER_NOT_FOUND_WITH_VALID_ROLE = 'error-messages.user_not_found_with_valid_role',
  INVALID_PHONE_FORMATE = 'error-messages.invalid_phone_formate',
  INCORRECT_PHONE = 'error-messages.incorrect_phone',
  INVALID_PHONE = 'error-messages.invalid_phone',
  NOT_ALLOWED = 'error-messages.not_allowed',

  // Network and technical errors
  NETWORK_ERROR = 'error-messages.network_error',
  TECHNICAL_ERROR = 'error-messages.technical_error',

  // Authentication errors
  BIOMETRIC_DISABLED = 'error-messages.biometric_disabled',
  CREDENTIALS_NOT_FOUND = 'error-messages.credentials_not_found',
  PASSWORD_REQUIREMENTS = 'error-messages.password_requirements',
  INCORRECT_PASSWORD = 'error-messages.incorrect_password',

  // User input errors
  INVALID_FULL_NAME = 'error-messages.invalid_full_name',
  INVALID_MILITARY_ID = 'error-messages.invalid_military_id',
  INVALID_EMAIL = 'error-messages.invalid_email',
  INVALID_REFERRAL_CODE = 'error-messages.invalid_referral_code',
  MISSING_FIELDS = 'error-messages.missing_fields',
  INVALID_MYKAD = 'error-messages.invalid_mykad',

  // Biometric and face recognition
  FACE_SCAN_FAILED = 'error-messages.face_scan_failed',

  // Store and inventory
  STORE_LOCATION_UNAVAILABLE = 'error-messages.store_location_unavailable',
  NO_SEARCH_RESULTS = 'error-messages.no_search_results',
  QUANTITY_NOT_SELECTED = 'error-messages.quantity_not_selected',
  ITEM_OUT_OF_STOCK = 'error-messages.item_out_of_stock',
  EMPTY_CART = 'error-messages.empty_cart',

  // OTP related
  OTP_VERIFICATION_FAILED = 'error-messages.otp_verification_failed',
  OTP_SENDING_FAILED = 'error-messages.otp_sending_failed',
  OTP_SENT_SUCCESSFULLY = 'error-messages.otp_sent_successfully',

  // Biometric related
  BIOMETRIC_VERIFICATION_FAILED = 'error-messages.biometric_verification_failed',
  BIOMETRIC_CHALLENGE_EXPIRY = 'error-messages.biometric_challenge_expiry',
  BIOMETRIC_CHALLENGE_ERROR = 'error-messages.biometric_challenge_error',
  ENABLE_BIOMETRIC_ERROR = 'error-messages.enable_biometric_error',
  DISABLE_BIOMETRIC_ERROR = 'error-messages.disable_biometric_error',
  ERROR_BIOMETRIC_VERIFICATION = 'error-messages.error_biometric_verification',

  // User related
  SELF_ACTION_ERROR = 'error-messages.self_action_error',
  USER_ID_REQUIRED = 'error-messages.user_id_required',
  USER_DOCUMENT_UNPROCESSABLE = 'error-messages.user_document_unprocessable',
  PASSWORD_CRITERIA_FAILED = 'error-messages.password_criteria_failed',

  // Notification related
  NOTIFICATION_FETCH_ERROR = 'error-messages.notification_fetch_error',
  NOTIFICATION_ID_REQUIRED = 'error-messages.notification_id_required',
  NOTIFICATION_UPDATE_ERROR = 'error-messages.notification_update_error',
  NOTIFICATION_MARK_ALL_READ_ERROR = 'error-messages.notification_mark_all_read_error',

  // Article related
  ARTICLE_NOT_FAVORITE_ERROR = 'error-messages.article_not_favorite_error',
  ARTICLE_ALREADY_FAVORITED_ERROR = 'error-messages.article_already_favorited_error',

  // System related
  REDIS_CONFIGURATION_ERROR = 'error-messages.redis_configuration_error',
  GEN_AI_CONFIGURATION_ERROR = 'error-messages.gen_ai_configuration_error',

  // Following related
  NOT_FOLLOWING_ERROR = 'error-messages.not_following_error',
  ALREADY_FOLLOWING_ERROR = 'error-messages.already_following_error',

  // RazorPay related
  RAZORPAY_ORDER_CREATE_FAILED = 'error-messages.failed_to_create_razorpay_order',
  PAYMENT_VERIFICATION_FAILED = 'error-messages.payment_verification_failed',
  PAYMENT_UPDATE_FAILED = 'error-messages.payment_update_failed',
  INVALID_WEBHOOK_SIGNATURE = 'error-messages.invalid_webhook_signature',
  WEBHOOK_PROCESSING_FAILED = 'error-messages.failed_to_process_webhook',
  PAYMENT_RECORD_UPDATE_FAILED = 'error-messages.failed_to_update_payment_record',
  FAILED_PAYMENT_RECORD_UPDATE_FAILED = 'error-messages.failed_to_update_failed_payment_record',

  // Family member related
  FAMILY_MYKAD_ID_EXISTS = 'error-messages.family_member.mykad_id_exists',
  FAMILY_PRIMARY_MEMBER_EXISTS = 'error-messages.family_member.primary_member_exists',
  FAMILY_USER_WITH_MYKAD_EXISTS = 'error-messages.family_member.user_with_mykad_exists',
  FAMILY_USER_WITH_PHONE_EXISTS = 'error-messages.family_member.user_with_phone_exists',
  FAMILY_NOT_FOUND = 'error-messages.family_member.not_found',
  FAMILY_METHOD_NOT_FOUND = 'error-messages.family_member.method_not_found',
  FAMILY_PRIMARY_MEMBER_NOT_ALLOWED = 'error-messages.family_member.primary_member_not_allowed',
  FAMILY_MEMBER_NOT_CREATED = 'error-messages.family_member.member_not_created',

  // Generic errors
  METHOD_NOT_FOUND = 'error-messages.method_not_found',
  NOTIFICATION_COUNT_ERROR = 'error-messages.notification_count_error',
}

/**
 * Enum for response message translation keys
 */
export enum ResponseKey {
  USER_REGISTERED = 'response-messages.user_registered',
  PASSWORD_SET = 'response-messages.password_set',
  PASSWORD_RESET = 'response-messages.password_reset',
  OTP_VERIFIED = 'response-messages.otp_verified',
  FORGET_PASSWORD = 'response-messages.forget_password',
  PENDING_STATE = 'response-messages.pending_state',
  PASSWORD_UPDATED = 'response-messages.password_updated',
  PROFILE_UPDATED = 'response-messages.profile_updated',
  USER_REGISTER_NOTIFICATION = 'response-messages.user_register_notification',
  ASSET_APPROVED_NOTIFICATION = 'response-messages.asset_approve_notification',
  ASSET_STATUS_UPDATE = 'response-messages.asset_status_update',
  USER_REGISTER_NOTIFICATION_TITLE = 'response-messages.user_register_notification_title',
  SAVE_AS_DRAFT = 'response-messages.save_as_draft',
  PUBLISH = 'response-messages.publish_now',
  WAITING_FOR_APPROVAL = 'response-messages.save_for_approval',
  USER_STATUS_REJECTED = 'response-messages.user_status_rejected',
  USER_STATUS_APPROVED = 'response-messages.user_status_approved',
  USER_STATUS_RESUBMIT = 'response-messages.user_status_resubmit',
  USER_STATUS_TITLE = 'response-messages.user_status_title',
}
