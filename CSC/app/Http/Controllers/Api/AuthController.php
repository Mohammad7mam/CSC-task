<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\FirebaseService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    protected $firebase;

    public function __construct(FirebaseService $firebase)
    {
        $this->firebase = $firebase;
    }

    /**
     * تسجيل مستخدم جديد
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'firstName' => 'required|string',
            'lastName' => 'required|string',
            'email' => 'required|email',
            'password' => 'required|min:6'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        try {
            $user = $this->firebase->createUser([
                'firstName' => $request->firstName,
                'lastName' => $request->lastName,
                'email' => $request->email,
                'password' => $request->password,
                'userType' => $request->userType ?? 'student'
            ]);

            $token = $this->firebase->createCustomToken($user->uid);

            return response()->json([
                'success' => true,
                'message' => 'تم التسجيل',
                'user' => [
                    'uid' => $user->uid,
                    'email' => $user->email,
                    'displayName' => $user->displayName
                ],
                'token' => (string)$token
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'خطأ في التسجيل',
                'error' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * تسجيل الدخول
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        try {
            // جرب بدون firebase أول للتأكد
            return response()->json([
                'success' => true,
                'message' => 'API شغال - لكن Firebase فيه مشكلة',
                'email' => $request->email,
                'test' => 'هذا اختبار فقط'
            ]);
            
            // الكود الأصلي (معلق حالياً):
            /*
            $user = $this->firebase->getUserByEmail($request->email);
            $userData = $this->firebase->getUserData($user->uid);
            
            $token = $this->firebase->createCustomToken($user->uid);

            return response()->json([
                'success' => true,
                'message' => 'تم تسجيل الدخول',
                'user' => [
                    'uid' => $user->uid,
                    'email' => $user->email,
                    'displayName' => $user->displayName,
                    'userType' => $userData['userType'] ?? 'student'
                ],
                'token' => (string)$token
            ]);
            */

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'بيانات الدخول غير صحيحة'
            ], 401);
        }
    }

    /**
     * بيانات المستخدم الحالي
     */
    public function getUser(Request $request)
    {
        try {
            $token = $request->bearerToken();
            if (!$token) return response()->json(['success' => false, 'message' => 'Token مطلوب'], 401);

            // جرب بدون firebase أول
            return response()->json([
                'success' => true,
                'message' => 'API شغال - Token وصل',
                'token_received' => substr($token, 0, 20) . '...' // جزء من التوكن فقط
            ]);
            
            /*
            // الكود الأصلي:
            $verified = $this->firebase->verifyIdToken($token);
            $uid = $verified->claims()->get('sub');
            
            $user = $this->firebase->getUserByEmail($uid); // هنا الخطأ! getUserByEmail بدل getUserByUid
            $userData = $this->firebase->getUserData($uid);

            return response()->json([
                'success' => true,
                'user' => [
                    'uid' => $uid,
                    'email' => $user->email,
                    'displayName' => $user->displayName,
                    'userType' => $userData['userType'] ?? 'student'
                ]
            ]);
            */

        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Token غير صالح'], 401);
        }
    }

    /**
     * تسجيل الخروج
     */
    public function logout(Request $request)
    {
        return response()->json(['success' => true, 'message' => 'تم تسجيل الخروج']);
    }
}