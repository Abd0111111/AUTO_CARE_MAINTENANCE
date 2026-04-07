import { StyleSheet } from 'react-native';
import { APP_COLORS } from '@/constants/app-colors';

const C = APP_COLORS;

export const createAccountStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.background,
  },
  keyboardView: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minWidth: 72,
  },
  backLabel: {
    color: C.text,
    fontSize: 16,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  logoIcon: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: C.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIconText: {
    color: C.text,
    fontSize: 12,
    fontWeight: '700',
  },
  logoAi: {
    color: C.text,
    fontSize: 14,
    fontWeight: '600',
  },
  appTitle: {
    color: C.text,
    fontSize: 12,
    marginTop: 2,
  },
  viewChatButton: {
    backgroundColor: C.accent,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewChatText: {
    color: C.text,
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    color: C.text,
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 24,
  },
  subtitle: {
    color: C.textMuted,
    fontSize: 15,
    marginTop: 6,
    marginBottom: 28,
  },
  form: {
    gap: 16,
  },
  label: {
    color: C.text,
    fontSize: 15,
    fontWeight: '500',
    marginBottom: -8,
  },
  input: {
    backgroundColor: C.inputBg,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: C.text,
  },
  inputError: {
    borderWidth: 1,
    borderColor: C.error,
  },
  selectBox: {
    backgroundColor: C.inputBg,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectBoxError: {
    borderWidth: 1,
    borderColor: C.error,
  },
  inputPlaceholder: {
    color: C.textMuted,
    fontSize: 16,
    flex: 1,
  },
  errorText: {
    color: C.error,
    fontSize: 13,
    marginTop: 4,
  },
  continueButton: {
    backgroundColor: C.accent,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 28,
  },
  continueText: {
    color: C.text,
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    flexWrap: 'wrap',
  },
  footerText: {
    color: C.textMuted,
    fontSize: 15,
  },
  signInLink: {
    color: C.accent,
    fontSize: 15,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: C.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 32,
    maxHeight: '50%',
  },
  modalOption: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  modalOptionText: {
    color: C.text,
    fontSize: 16,
  },
});
