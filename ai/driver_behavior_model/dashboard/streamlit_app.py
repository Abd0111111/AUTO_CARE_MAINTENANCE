import streamlit as st
import requests

st.set_page_config(page_title="Driver Behavior AI v2", layout="centered")

st.title("🚗 Smart Driver Behavior Analyzer")
st.markdown("---")

st.info("قم بإدخال قراءات الحساسات (3 قراءات لكل محور) لمحاكاة نافذة زمنية")


# دالة التحويل
def str_to_list(s):
    try:
        return [float(x.strip()) for x in s.split(',') if x.strip()]
    except:
        return None


# واجهة المدخلات
col1, col2, col3 = st.columns(3)
with col1: ax = st.text_input("Acc X", "0.0, 0.0, 0.0")
with col2: ay = st.text_input("Acc Y", "0.0, 0.0, 0.0")
with col3: az = st.text_input("Acc Z", "9.8, 9.8, 9.8")

col4, col5, col6 = st.columns(3)
with col4: gx = st.text_input("Gyro X", "0.0, 0.0, 0.0")
with col5: gy = st.text_input("Gyro Y", "0.0, 0.0, 0.0")
with col6: gz = st.text_input("Gyro Z", "0.0, 0.0, 0.0")

if st.button("Analyze Driving Score", use_container_width=True):
    ax_l, ay_l, az_l = str_to_list(ax), str_to_list(ay), str_to_list(az)
    gx_l, gy_l, gz_l = str_to_list(gx), str_to_list(gy), str_to_list(gz)

    if None in [ax_l, ay_l, az_l, gx_l, gy_l, gz_l]:
        st.error("⚠️ خطأ: تأكد من كتابة أرقام فقط وفصلها بفاصلة")
    elif not (len(ax_l) == len(ay_l) == len(az_l) == len(gx_l)):
        st.error("⚠️ خطأ: يجب إدخال نفس عدد القيم في كل الخانات")
    else:
        try:
            # تجهيز البيانات
            acc_data = [{"x": ax_l[i], "y": ay_l[i], "z": az_l[i]} for i in range(len(ax_l))]
            gyro_data = [{"x": gx_l[i], "y": gy_l[i], "z": gz_l[i]} for i in range(len(gx_l))]
            payload = {"acc": acc_data, "gyro": gyro_data}

            # طلب الـ API
            response = requests.post("http://127.0.0.1:5000/predict", json=payload)

            if response.status_code == 200:
                result = response.json()
                score = result.get('score', 0)
                status = result.get('status', 'Unknown')

                st.markdown("---")
                st.subheader("📊 Analysis Results")

                # 1. تحديد الألوان والأيقونات بناءً على الحالة
                if score > 80:
                    color = "#28a745"  # أخضر (Excellent)
                    icon = "🟢"
                    tips = "Excellent performance! Keep up the smooth driving."
                elif score > 60:
                    color = "#ffc107"  # أصفر (Good)
                    icon = "🟡"
                    tips = "Good driving, but try to avoid sudden movements."
                elif score > 40:
                    color = "#fd7e14"  # برتقالي (Risky)
                    icon = "🟠"
                    tips = "Warning: Some aggressive patterns detected."
                else:
                    color = "#dc3545"  # أحمر (Aggressive)
                    icon = "🔴"
                    tips = "Danger! High aggressive behavior detected. Drive safely!"

                # 2. عرض كارت النتيجة الاحترافي
                st.markdown(f"""
                                <div style="
                                    border: 2px solid {color}; 
                                    padding: 25px; 
                                    border-radius: 15px; 
                                    text-align: center;
                                    box-shadow: 2px 2px 10px rgba(0,0,0,0.1);
                                ">
                                    <h1 style="color: {color}; margin: 0; font-size: 50px;">{icon} {status}</h1>
                                    <p style="color: #444; font-size: 20px; margin-top: 10px;">
                                        <b>Driver Behavior Score</b>
                                    </p>
                                    <h2 style="color: {color}; margin: 0; font-size: 40px;">{score}%</h2>
                                </div>
                            """, unsafe_allow_html=True)

                # 3. إضافة نصيحة أسفل الكارت
                st.info(f"💡 **Recommendation:** {tips}")

                # 4. شريط تقدم أنيق
                st.write("Confidence Level:")
                st.progress(float(score) / 100)

            else:
                st.error(f"❌ API Error: {response.status_code}")

        except Exception as e:
            st.error(f"خطأ في الاتصال: تأكد من تشغيل ملف app.py أولاً")
            st.write(f"تفاصيل الخطأ: {e}")

            '''
            Acc X: 0.1, 0.2, 0.1

            Acc Y: 0.0, 0.1, 0.0

            Acc Z: 9.8, 9.7, 9.9

            Gyro X/Y/Z: 0, 0, 0
            '''