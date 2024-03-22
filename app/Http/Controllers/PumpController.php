<?php

namespace App\Http\Controllers;

use App\Models\Pump;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PumpController extends Controller
{
    public function index() {
        return response()->json(Pump::all());
    }

    public function create(Request $request): \Illuminate\Http\JsonResponse
    {
        $request->validate([
            'file' => 'required|image|mimes:jpeg,jpg,png'
        ]);

        $ext = $request->file->extension();
        $imageName = md5(time().'.'.$ext);

        if($request->file->move(public_path('media/images'), $imageName)) {
            $new_pump = [
                'image_url' => asset('media/images'.$imageName),
                'name' => $request->name,
                'description' => $request->description
            ];

            $pump = new Pump($new_pump);
            $pump->save();
        }

        $id = $pump->id;

//        return Inertia::render('Index', [
//            'pumps' => Pump::find($id)
//        ]);

        return response()->json(Pump::find($id));
    }
}
