package com.sahiljadhav.campusconnect.data.api

import com.sahiljadhav.campusconnect.data.model.*
import retrofit2.Response
import retrofit2.http.*

interface AuthApiService {

    @POST("api/auth/login")
    suspend fun login(
        @Body body: LoginRequest
    ): Response<AuthResponse>

    @POST("api/auth/register")
    suspend fun register(
        @Body body: RegisterRequest
    ): Response<AuthResponse>

    @GET("api/auth/profile")
    suspend fun getProfile(): ProfileResponse

    @POST("api/auth/profile")
    suspend fun updateProfile(
        @Body body: UpdateProfileRequest
    ): ProfileResponse

    @POST("api/auth/delete-account")
    suspend fun deleteAccount(): SimpleResponse

    @POST("api/favourites/sync")
    suspend fun syncFavourites(
        @Body body: Map<String, String>
    ): SyncResponse

    @GET("api/orders/my-orders")
    suspend fun getMyOrders(): MyOrdersResponse

    @GET("api/lost-found/my-reports")
    suspend fun getMyReports(): MyReportsResponse

    @DELETE("api/lost-found/item/{id}")
    suspend fun deleteReport(
        @Path("id") id: Long,
        @Query("type") type: String? = null
    ): SimpleResponse

    @PUT("api/lost-found/item/{id}")
    suspend fun updateReport(
        @Path("id") id: Long,
        @Query("type") type: String? = null,
        @Body body: UpdateReportRequest
    ): SimpleResponse
}
