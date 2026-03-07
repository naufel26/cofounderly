import { useForm } from '@inertiajs/react';
import { X, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface EditProfileModalProps {
    user: any;
    isOpen: boolean;
    onClose: (open: boolean) => void;
}

export function EditProfileModal({
    user,
    isOpen,
    onClose,
}: EditProfileModalProps) {
    const { data, setData, post, processing } = useForm({
        name: user?.name || '',
        tagline: user?.tagline || '',
        email: user?.email || '',
        location: user?.location || '',
        linkedin_url: user?.linkedin_url || '',
        bio: user?.bio || '',
        professional_summary: user?.professional_summary || '',
        role: user?.role || 'Founder',
        looking_for: user?.looking_for || 'Cofounder',
        business_stage: user?.business_stage || 'MVP',
        skills: user?.skills || [],
    });

    const submitProfile = (e: React.FormEvent) => {
        e.preventDefault();
        post('/profile/update-profile', {
            onSuccess: () => {
                onClose(false);
                toast.success('Profile updated successfully!');
            },
        });
    };

    const removeSkill = (skillToRemove: string) => {
        setData(
            'skills',
            data.skills.filter((skill: string) => skill !== skillToRemove),
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="flex h-[90vh] max-w-2xl flex-col overflow-hidden border-none bg-white p-0 shadow-xl">
                {/* Header with Save Changes Button */}
                <DialogHeader className="z-10 flex shrink-0 flex-row items-center justify-between border-b border-slate-100 bg-white px-8 py-5">
                    <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">
                        Edit Profile
                    </DialogTitle>
                    <Button
                        onClick={submitProfile}
                        disabled={processing}
                        className="h-11 rounded-xl bg-[#2DAB94] px-8 font-bold text-white shadow-lg shadow-teal-100 transition-all hover:bg-[#248d7a] active:scale-95"
                    >
                        {processing ? 'Saving...' : 'Save Changes'}
                    </Button>
                </DialogHeader>

                <form
                    onSubmit={submitProfile}
                    className="flex min-h-0 flex-1 flex-col overflow-hidden"
                >
                    <div className="custom-scrollbar flex-1 space-y-10 overflow-y-auto p-8">
                        {/* 1. Basic Information */}
                        <section className="space-y-6">
                            <h3 className="border-b border-slate-100 pb-2 text-lg font-bold text-slate-800">
                                Basic Information
                            </h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="font-semibold text-slate-700">
                                        Name
                                    </Label>
                                    <Input
                                        value={data.name || ''}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        className="h-12 rounded-xl border-slate-200 bg-slate-50/30"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-semibold text-slate-700">
                                        Tagline
                                    </Label>
                                    <Input
                                        value={data.tagline || ''}
                                        onChange={(e) =>
                                            setData('tagline', e.target.value)
                                        }
                                        className="h-12 rounded-xl border-slate-200 bg-slate-50/30"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-semibold text-slate-700">
                                        Email
                                    </Label>
                                    <Input
                                        value={data.email || ''}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                        className="h-12 rounded-xl border-slate-200 bg-slate-50/30"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-semibold text-slate-700">
                                        Location
                                    </Label>
                                    <Input
                                        value={data.location || ''}
                                        onChange={(e) =>
                                            setData('location', e.target.value)
                                        }
                                        className="h-12 rounded-xl border-slate-200 bg-slate-50/30"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-semibold text-slate-700">
                                        LinkedIn Profile URL
                                    </Label>
                                    <Input
                                        value={data.linkedin_url || ''}
                                        onChange={(e) =>
                                            setData(
                                                'linkedin_url',
                                                e.target.value,
                                            )
                                        }
                                        className="h-12 rounded-xl border-slate-200 bg-slate-50/30"
                                    />
                                    <p className="text-[11px] text-slate-400">
                                        Recommended for credibility
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* 2. About */}
                        <section className="space-y-6">
                            <h3 className="border-b border-slate-100 pb-2 text-lg font-bold text-slate-800">
                                About
                            </h3>
                            <div className="space-y-2">
                                <Label className="font-semibold text-slate-700">
                                    Bio
                                </Label>
                                <Textarea
                                    value={data.bio || ''}
                                    onChange={(e) =>
                                        setData(
                                            'bio',
                                            e.target.value.slice(0, 300),
                                        )
                                    }
                                    className="min-h-[120px] resize-none rounded-xl border-slate-200 bg-slate-50/30"
                                />
                                <p className="text-right text-[11px] text-slate-400">
                                    {data.bio?.length || 0}/300 characters
                                </p>
                            </div>
                        </section>

                        {/* 3. Professional Summary */}
                        <section className="space-y-6">
                            <h3 className="border-b border-slate-100 pb-2 text-lg font-bold text-slate-800">
                                Professional Summary
                            </h3>
                            <div className="space-y-2">
                                <Label className="font-semibold text-slate-700">
                                    Summary
                                </Label>
                                <Textarea
                                    value={data.professional_summary || ''}
                                    onChange={(e) =>
                                        setData(
                                            'professional_summary',
                                            e.target.value.slice(0, 500),
                                        )
                                    }
                                    className="min-h-[140px] resize-none rounded-xl border-slate-200 bg-slate-50/30"
                                />
                                <p className="text-right text-[11px] text-slate-400">
                                    {data.professional_summary?.length || 0}/500
                                    characters
                                </p>
                            </div>
                        </section>

                        {/* 4. Professional Information */}
                        <section className="space-y-6">
                            <h3 className="border-b border-slate-100 pb-2 text-lg font-bold text-slate-800">
                                Professional Information
                            </h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="font-semibold text-slate-700">
                                        Role
                                    </Label>
                                    <Select
                                        value={data.role || ''}
                                        onValueChange={(v) =>
                                            setData('role', v)
                                        }
                                    >
                                        <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-slate-50/30">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Founder">
                                                Founder
                                            </SelectItem>
                                            <SelectItem value="Investor">
                                                Investor
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-semibold text-slate-700">
                                        Looking For
                                    </Label>
                                    <Select
                                        value={data.looking_for || ''}
                                        onValueChange={(v) =>
                                            setData('looking_for', v)
                                        }
                                    >
                                        <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-slate-50/30">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Cofounder">
                                                Cofounder
                                            </SelectItem>
                                            <SelectItem value="Advisor">
                                                Advisor
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-semibold text-slate-700">
                                        Current Business Stage
                                    </Label>
                                    <Select
                                        value={data.business_stage || ''}
                                        onValueChange={(v) =>
                                            setData('business_stage', v)
                                        }
                                    >
                                        <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-slate-50/30">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Idea">
                                                Idea Stage
                                            </SelectItem>
                                            <SelectItem value="MVP">
                                                MVP
                                            </SelectItem>
                                            <SelectItem value="Scaling">
                                                Scaling
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </section>

                        {/* 5. Skills */}
                        <section className="space-y-6 pb-4">
                            <h3 className="border-b border-slate-100 pb-2 text-lg font-bold text-slate-800">
                                Skills
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {data.skills.map((skill: string) => (
                                    <div
                                        key={skill}
                                        className="flex items-center gap-1.5 rounded-full border border-[#2DAB94]/10 bg-[#E6F6F4] px-4 py-2 text-[13px] font-bold text-[#2DAB94]"
                                    >
                                        {skill}
                                        <X
                                            className="h-3.5 w-3.5 cursor-pointer opacity-60 hover:opacity-100"
                                            onClick={() => removeSkill(skill)}
                                        />
                                    </div>
                                ))}
                            </div>
                            <Button
                                variant="outline"
                                className="h-12 w-full rounded-xl border-2 border-dashed border-slate-200 text-slate-400 transition-all hover:border-[#2DAB94] hover:text-[#2DAB94]"
                            >
                                <Plus className="mr-2 h-4 w-4" /> Add skills
                            </Button>
                        </section>
                    </div>

                    {/* Footer for Cancel */}
                    <div className="flex shrink-0 justify-end gap-3 border-t p-6">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onClose(false)}
                            className="font-medium text-slate-500"
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
