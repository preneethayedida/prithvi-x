# PRITHVI-X Machine Learning & Analytics Methodology

## 1. Mathematical Formulation: PRITHVI-X Environmental Index (PEI)
$$\text{PEI} = w_T \cdot S_{\text{temp}} + w_R \cdot S_{\text{rain}} + w_H \cdot S_{\text{humidity}} + w_A \cdot S_{\text{aqi}}$$
- Default Weights: $w_T = 0.25$, $w_R = 0.25$, $w_H = 0.20$, $w_A = 0.30$.
- Scale: $0 \le \text{PEI} \le 100$.
- Categorization:
  - $\text{PEI} \ge 85$: `OPTIMAL`
  - $70 \le \text{PEI} < 85$: `GOOD`
  - $50 \le \text{PEI} < 70$: `MODERATE`
  - $30 \le \text{PEI} < 50$: `STRESSED`
  - $\text{PEI} < 30$: `CRITICAL`

## 2. Statistical Anomaly Detection
1. **Z-Score Filter ($Z = \frac{x - \mu}{\sigma}$)**:
   - Evaluates whether current observation deviates significantly from the 30-day baseline.
   - $|Z| \ge 2.0$: Flagged as Moderate Anomaly.
   - $|Z| \ge 2.5$: Flagged as High Anomaly.
   - $|Z| \ge 3.0$: Flagged as Severe Anomaly.
2. **Interquartile Range (IQR = $Q_3 - Q_1$)**:
   - Outliers flagged when $x > Q_3 + 1.5 \times \text{IQR}$ (especially effective for precipitation bursts).
3. **Multivariate Isolation Forest**:
   - Unsupervised tree partitioning algorithm from `scikit-learn` detecting abnormal interactions across temperature, humidity, and atmospheric pressure.

## 3. Machine Learning Time-Series Forecasting
- **Algorithm:** Random Forest Autoregressive Regressor (`sklearn.ensemble.RandomForestRegressor`).
- **Feature Matrix:**
  - Autoregressive lag features: $y_{t-1}, y_{t-2}, y_{t-3}$.
  - Rolling moments: 6-hour moving average ($\text{MA}_6$) and rolling standard deviation ($\text{Std}_6$).
  - Trigonometric diurnal features: $\sin(2\pi \cdot \text{hour}/24)$ and $\cos(2\pi \cdot \text{hour}/24)$.
- **Temporal Train/Test Split (Zero Data Leakage):**
  - Older 80% used strictly for training.
  - Subsequent 20% holdout used strictly for validation.
  - Random $k$-fold cross-validation is avoided to prevent temporal leakage.
- **Evaluation Reporting:**
  - Mean Absolute Error (MAE)
  - Root Mean Squared Error (RMSE)
  - Coefficient of Determination ($R^2$)
- **Scientific Responsibility:**
  - All forecasts explicitly present model type, training sample size, MAE bounds, and a disclaimer stating that projections are mathematical estimates and not official meteorological certainties.
