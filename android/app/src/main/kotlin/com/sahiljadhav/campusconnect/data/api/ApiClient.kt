package com.sahiljadhav.campusconnect.data.api

import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object ApiClient {
    // Primary deployed backend URLs from the live project
    const val CANTEEN_BASE_URL = "https://campus-connect-s85n.onrender.com/"
    const val LOST_FOUND_BASE_URL = "https://campus-connect-s85n.onrender.com/"

    @Volatile
    var currentAuthToken: String? = null

    private val authInterceptor = Interceptor { chain ->
        val original = chain.request()
        val token = currentAuthToken
        if (!token.isNullOrBlank()) {
            val authenticated = original.newBuilder()
                .header("Authorization", "Bearer $token")
                .build()
            chain.proceed(authenticated)
        } else {
            chain.proceed(original)
        }
    }

    private val okHttpClient by lazy {
        val logging = HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BODY
        }
        OkHttpClient.Builder()
            .connectTimeout(35, TimeUnit.SECONDS)
            .readTimeout(35, TimeUnit.SECONDS)
            .writeTimeout(35, TimeUnit.SECONDS)
            .retryOnConnectionFailure(true)
            .addInterceptor(authInterceptor)
            .addInterceptor(logging)
            .build()
    }

    private val canteenRetrofit by lazy {
        Retrofit.Builder()
            .baseUrl(CANTEEN_BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }

    private val lostFoundRetrofit by lazy {
        Retrofit.Builder()
            .baseUrl(LOST_FOUND_BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }

    // Secondary fallback Retrofit instances in case of temporary Render cold start on one instance
    private val canteenFallbackRetrofit by lazy {
        Retrofit.Builder()
            .baseUrl(LOST_FOUND_BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }

    private val lostFoundFallbackRetrofit by lazy {
        Retrofit.Builder()
            .baseUrl(CANTEEN_BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }

    val canteenApi: CanteenApiService by lazy {
        canteenRetrofit.create(CanteenApiService::class.java)
    }

    val canteenFallbackApi: CanteenApiService by lazy {
        canteenFallbackRetrofit.create(CanteenApiService::class.java)
    }

    val lostFoundApi: LostFoundApiService by lazy {
        lostFoundRetrofit.create(LostFoundApiService::class.java)
    }

    val lostFoundFallbackApi: LostFoundApiService by lazy {
        lostFoundFallbackRetrofit.create(LostFoundApiService::class.java)
    }

    val authApi: AuthApiService by lazy {
        canteenRetrofit.create(AuthApiService::class.java)
    }

    val authFallbackApi: AuthApiService by lazy {
        canteenFallbackRetrofit.create(AuthApiService::class.java)
    }
}
