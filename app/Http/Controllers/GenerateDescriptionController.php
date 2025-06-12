<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Prism\Prism\Enums\Provider;
use Prism\Prism\Prism;
use Prism\Prism\Schema\ArraySchema;
use Prism\Prism\Schema\ObjectSchema;
use Prism\Prism\Schema\StringSchema;

class GenerateDescriptionController extends Controller
{
    public function generate(Request $request)
    {
        $request->validate([
            'productName' => ['required'],
        ]);

        if ($request->variants) {
            $prompt = 'generate the description for the ecommerce website for the ' . $request->productName . ' having a following variant ';
            foreach ($request->variants as $variant) {
                $prompt = $prompt . $variant['name'];
            }
        } else {
            $prompt = 'generate the description for the ecommerce website for the ' . $request->productName;
        }


        $response = Prism::text()
            ->using(Provider::Gemini, 'gemini-2.0-flash')
            ->withSystemPrompt('You are a professional product description writer specialized in creating high-quality, SEO-friendly product descriptions for all kinds of eCommerce platforms including Amazon, Shopify, WooCommerce, Etsy, and more. Your descriptions are engaging, clear, and tailored to highlight product features, variants (such as color, size, material, etc.), and benefits to attract customers and improve search engine visibility. Always write in a friendly, persuasive, and informative tone suitable for online shopping audiences.')
            ->withPrompt($prompt)
            ->asText();
        return response()->json(['response' => $response->text]);
    }
}
