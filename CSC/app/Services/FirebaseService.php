<?php

namespace App\Services;

use Kreait\Firebase\Factory;
use Kreait\Firebase\Contract\Auth;
use Kreait\Firebase\Contract\Database;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class FirebaseService
{
    protected ?Auth $auth = null;
    protected ?Database $database = null;

    public function __construct()
    {
        // 1. جرب المسار الثابت أول
        $credentialsPath = storage_path('app/firebase-credentials.json');
        
        // 2. إذا ما موجود، جرب من الـ .env
        if (!file_exists($credentialsPath)) {
            $credentialsPath = storage_path('app/' . env('FIREBASE_CREDENTIALS', 'firebase-credentials.json'));
        }
        
        // 3. إذا لسا ما موجود، شغل بدون Firebase
        if (!file_exists($credentialsPath)) {
            Log::warning('Firebase credentials file not found: ' . $credentialsPath);
            return;
        }

        try {
            $factory = (new Factory)
                ->withServiceAccount($credentialsPath)
                ->withDatabaseUri('https://tst-csc-default-rtdb.firebaseio.com');

            $this->auth = $factory->createAuth();
            $this->database = $factory->createDatabase();
            
            Log::info('Firebase connected successfully');
            
        } catch (\Exception $e) {
            Log::error('Firebase connection error: ' . $e->getMessage());
            // استمر بدون Firebase
        }
    }

    // الأساسيات
    public function auth(): ?Auth { 
        return $this->auth; 
    }
    
    public function database(): ?Database { 
        return $this->database; 
    }

    // تسجيل مستخدم
    public function createUser(array $data)
    {
        if (!$this->auth) {
            throw new \Exception('Firebase not connected');
        }

        try {
            $user = $this->auth->createUser([
                'email' => $data['email'],
                'password' => $data['password'],
                'displayName' => $data['fullName'] ?? $data['firstName'] . ' ' . $data['lastName']
            ]);

            // حفظ في قاعدة البيانات
            $this->database->getReference('users/' . $user->uid)->set([
                'uid' => $user->uid,
                'email' => $data['email'],
                'firstName' => $data['firstName'] ?? '',
                'lastName' => $data['lastName'] ?? '',
                'fullName' => $data['fullName'] ?? $data['firstName'] . ' ' . $data['lastName'],
                'userType' => $data['userType'] ?? 'student',
                'createdAt' => date('Y-m-d H:i:s')
            ]);

            return $user;

        } catch (\Exception $e) {
            Log::error('Firebase createUser error: ' . $e->getMessage());
            throw $e;
        }
    }

    // التحقق من التوكن
    public function verifyIdToken(string $token)
    {
        if (!$this->auth) {
            throw new \Exception('Firebase not connected');
        }
        return $this->auth->verifyIdToken($token);
    }

    // الحصول على بيانات مستخدم
    public function getUserData(string $uid)
    {
        if (!$this->database) {
            throw new \Exception('Firebase not connected');
        }
        
        $data = $this->database->getReference('users/' . $uid)->getValue();
        
        if (!$data) {
            throw new \Exception('User not found in Firebase');
        }
        
        return $data;
    }

    // البحث بالبريد
    public function getUserByEmail(string $email)
    {
        if (!$this->auth) {
            throw new \Exception('Firebase not connected');
        }
        return $this->auth->getUserByEmail($email);
    }

    // إنشاء توكن مخصص
    public function createCustomToken(string $uid)
    {
        if (!$this->auth) {
            throw new \Exception('Firebase not connected');
        }
        return $this->auth->createCustomToken($uid);
    }

    // دالة اختبار الاتصال
    public function testConnection()
    {
        if (!$this->database) {
            return ['connected' => false, 'message' => 'Firebase not initialized'];
        }
        
        try {
            $data = $this->database->getReference('users')->getValue();
            return [
                'connected' => true,
                'message' => 'Connected to Firebase',
                'users_count' => $data ? count($data) : 0
            ];
        } catch (\Exception $e) {
            return ['connected' => false, 'message' => $e->getMessage()];
        }
    }
}