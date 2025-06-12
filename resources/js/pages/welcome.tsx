import AppearanceTabs from '@/components/appearance-tabs';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Toaster } from '@/components/ui/sonner';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { Copy, LoaderCircle, Plus, Trash } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toast } from 'sonner';

export default function Welcome() {
    const [variants, setVariants] = useState([{ id: Date.now(), name: '' }]);
    const [productName, setProductName] = useState('');
    const [processing, setProcessing] = useState(false);

    const [response, setResponse] = useState('# Enter Product Information and click generate description to see the magic!');

    const addVariant = () => {
        setVariants([...variants, { id: Date.now(), name: '' }]);
    };

    const removeVariant = (id: number) => {
        setVariants(variants.filter((variant) => variant.id !== id));
    };

    const handleVariantChange = (id: number, value: string) => {
        setVariants(variants.map((variant) => (variant.id === id ? { ...variant, name: value } : variant)));
    };

    const submitHandle: FormEventHandler = async (e) => {
        e.preventDefault();
        try {
            const data = {
                productName: productName,
                variants: variants,
            };
            console.log(data);
            setProcessing(!processing);
            await axios
                .post('/generate_description', data)
                .then((res) => {
                    setProcessing(false);
                    setResponse(res.data.response);
                    toast.success('Description Generated.');
                })
                .catch((error) => toast.error(error));
        } catch (error) {
            console.log(error);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <Toaster position="top-center" closeButton={true} />
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    <nav className="flex items-center justify-end gap-4">
                        <AppearanceTabs />
                    </nav>
                </header>
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full max-w-[335px] flex-col-reverse lg:max-w-4xl lg:flex-row">
                        <div className="mx-auto w-full space-y-6 p-6">
                            <Card className="rounded-2xl border shadow-xl">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-bold">Product Description Generator</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <form className="flex flex-col gap-6" onSubmit={submitHandle}>
                                        <div>
                                            <label className="mb-1 block text-sm font-medium">Product Name</label>
                                            <Input placeholder="Enter product name" onChange={(e) => setProductName(e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-sm font-medium">Variants</label>
                                            <div className="space-y-2">
                                                {variants.map((variant, index) => (
                                                    <div key={variant.id} className="flex gap-2">
                                                        <Input
                                                            placeholder={`Variant ${index + 1} (e.g. Color, Size)`}
                                                            value={variant.name}
                                                            onChange={(e) => handleVariantChange(variant.id, e.target.value)}
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="icon"
                                                            onClick={() => removeVariant(variant.id)}
                                                        >
                                                            <Trash className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ))}
                                                <Button type="button" onClick={addVariant}>
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    Add Variant
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Description Field */}
                                        <div>
                                            <div className="mb-3 flex items-center justify-between align-middle">
                                                <label className="mb-1 block text-sm font-medium">Generated Description</label>
                                                <CopyToClipboard onCopy={() => toast.success('Copied.')} text={response}>
                                                    <a className={buttonVariants({ variant: 'outline' })}>
                                                        <Copy /> Copy
                                                    </a>
                                                </CopyToClipboard>
                                            </div>
                                            <div className="rounded-lg border p-3 py-6">
                                                <Markdown remarkPlugins={[remarkGfm]}>{response}</Markdown>
                                            </div>
                                        </div>

                                        {/* Generate Button */}
                                        <Button className="w-full" disabled={processing}>
                                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                            Generate Description
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </main>
                </div>
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}
