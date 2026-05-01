import { useForm } from '@inertiajs/react';
import { Plus, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
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

interface ExperienceEntry {
    id: string;
    title: string;
    company: string;
    from_date: string;
    to_date: string;
    is_current: boolean;
    description: string;
}

interface EditProfileModalProps {
    user: any;
    isOpen: boolean;
    onClose: (open: boolean) => void;
}

function makeExperienceId() {
    return Math.random().toString(36).slice(2);
}

export function EditProfileModal({ user, isOpen, onClose }: EditProfileModalProps) {
    const { data, setData, post, processing } = useForm({
        name: user?.name || '',
        tagline: user?.tagline || '',
        email: user?.email || '',
        location: user?.location || '',
        linkedin_url: user?.linkedin_url || '',
        website: user?.website || '',
        bio: user?.bio || '',
        professional_summary: user?.professional_summary || '',
        role: user?.role || 'Founder',
        looking_for: user?.looking_for || 'Cofounder',
        business_stage: user?.business_stage || 'MVP',
        skills: (user?.skills as string[]) || [],
        experience: (user?.experience as ExperienceEntry[]) || [],
    });

    const submitProfile = (e: React.FormEvent) => {
        e.preventDefault();
        post('/profile/update-profile', {
            onSuccess: () => {
                onClose(false);
                toast.success('Profile updated!');
            },
        });
    };

    const removeSkill = (skill: string) =>
        setData('skills', data.skills.filter((s) => s !== skill));

    const addExperience = () =>
        setData('experience', [
            ...data.experience,
            {
                id: makeExperienceId(),
                title: '',
                company: '',
                from_date: '',
                to_date: '',
                is_current: false,
                description: '',
            },
        ]);

    const updateExperience = (id: string, field: keyof ExperienceEntry, value: string | boolean) =>
        setData(
            'experience',
            data.experience.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
        );

    const removeExperience = (id: string) =>
        setData('experience', data.experience.filter((e) => e.id !== id));

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="flex h-[90vh] max-w-2xl flex-col overflow-hidden border-none bg-white p-0 shadow-xl">
                <DialogHeader className="z-10 flex shrink-0 flex-row items-center justify-between border-b border-slate-100 bg-white px-8 py-5">
                    <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">
                        Edit Profile
                    </DialogTitle>
                    <Button
                        onClick={submitProfile}
                        disabled={processing}
                        className="h-11 rounded-xl bg-[#2DAB94] px-8 font-bold text-white shadow-lg shadow-teal-100 hover:bg-[#248d7a] active:scale-95"
                    >
                        {processing ? 'Saving...' : 'Save Changes'}
                    </Button>
                </DialogHeader>

                <form onSubmit={submitProfile} className="flex min-h-0 flex-1 flex-col overflow-hidden">
                    <div className="custom-scrollbar flex-1 space-y-10 overflow-y-auto p-8">

                        {/* Basic Info */}
                        <section className="space-y-6">
                            <h3 className="border-b border-slate-100 pb-2 text-lg font-bold text-slate-800">
                                Basic Information
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { label: 'Name', key: 'name' as const },
                                    { label: 'Tagline', key: 'tagline' as const },
                                    { label: 'Email', key: 'email' as const },
                                    { label: 'Location', key: 'location' as const },
                                ].map(({ label, key }) => (
                                    <div key={key} className="space-y-2">
                                        <Label className="font-semibold text-slate-700">{label}</Label>
                                        <Input
                                            value={data[key] || ''}
                                            onChange={(e) => setData(key, e.target.value)}
                                            className="h-12 rounded-xl border-slate-200 bg-slate-50/30"
                                        />
                                    </div>
                                ))}
                                <div className="space-y-2">
                                    <Label className="font-semibold text-slate-700">LinkedIn URL</Label>
                                    <Input
                                        value={data.linkedin_url || ''}
                                        onChange={(e) => setData('linkedin_url', e.target.value)}
                                        className="h-12 rounded-xl border-slate-200 bg-slate-50/30"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-semibold text-slate-700">Website URL</Label>
                                    <Input
                                        value={data.website || ''}
                                        onChange={(e) => setData('website', e.target.value)}
                                        placeholder="https://yoursite.com"
                                        className="h-12 rounded-xl border-slate-200 bg-slate-50/30"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* About */}
                        <section className="space-y-6">
                            <h3 className="border-b border-slate-100 pb-2 text-lg font-bold text-slate-800">
                                About
                            </h3>
                            <div className="space-y-2">
                                <Label className="font-semibold text-slate-700">Bio</Label>
                                <Textarea
                                    value={data.bio || ''}
                                    onChange={(e) => setData('bio', e.target.value.slice(0, 300))}
                                    className="min-h-[100px] resize-none rounded-xl border-slate-200 bg-slate-50/30"
                                />
                                <p className="text-right text-[11px] text-slate-400">
                                    {data.bio?.length || 0}/300
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label className="font-semibold text-slate-700">Professional Summary</Label>
                                <Textarea
                                    value={data.professional_summary || ''}
                                    onChange={(e) => setData('professional_summary', e.target.value.slice(0, 500))}
                                    className="min-h-[120px] resize-none rounded-xl border-slate-200 bg-slate-50/30"
                                />
                                <p className="text-right text-[11px] text-slate-400">
                                    {data.professional_summary?.length || 0}/500
                                </p>
                            </div>
                        </section>

                        {/* Professional Info */}
                        <section className="space-y-6">
                            <h3 className="border-b border-slate-100 pb-2 text-lg font-bold text-slate-800">
                                Professional Information
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { label: 'Role', key: 'role' as const, options: ['Founder', 'Investor', 'Advisor', 'Engineer', 'Designer'] },
                                    { label: 'Looking For', key: 'looking_for' as const, options: ['Cofounder', 'Advisor', 'Investor', 'Engineer', 'Designer'] },
                                    { label: 'Business Stage', key: 'business_stage' as const, options: ['Idea', 'MVP', 'Scaling', 'Growth', 'Exit'] },
                                ].map(({ label, key, options }) => (
                                    <div key={key} className="space-y-2">
                                        <Label className="font-semibold text-slate-700">{label}</Label>
                                        <Select value={data[key] || ''} onValueChange={(v) => setData(key, v)}>
                                            <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-slate-50/30">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {options.map((o) => (
                                                    <SelectItem key={o} value={o}>{o}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Skills */}
                        <section className="space-y-4">
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
                                type="button"
                                variant="outline"
                                className="h-11 w-full rounded-xl border-2 border-dashed border-slate-200 text-slate-400 hover:border-[#2DAB94] hover:text-[#2DAB94]"
                                onClick={() => {
                                    const skill = window.prompt('Add a skill:');
                                    if (skill?.trim()) setData('skills', [...data.skills, skill.trim()]);
                                }}
                            >
                                <Plus className="mr-2 h-4 w-4" /> Add Skill
                            </Button>
                        </section>

                        {/* Experience */}
                        <section className="space-y-4 pb-4">
                            <h3 className="border-b border-slate-100 pb-2 text-lg font-bold text-slate-800">
                                Experience
                            </h3>

                            {data.experience.map((entry, idx) => (
                                <div key={entry.id} className="relative space-y-3 rounded-xl border border-slate-200 bg-slate-50/30 p-4">
                                    <button
                                        type="button"
                                        onClick={() => removeExperience(entry.id)}
                                        className="absolute right-3 top-3 text-slate-300 hover:text-red-400"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>

                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Experience {idx + 1}
                                    </p>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <Label className="text-xs font-semibold text-slate-600">Title *</Label>
                                            <Input
                                                value={entry.title}
                                                onChange={(e) => updateExperience(entry.id, 'title', e.target.value)}
                                                placeholder="e.g. CTO"
                                                className="h-10 rounded-xl border-slate-200 bg-white text-sm"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs font-semibold text-slate-600">Company *</Label>
                                            <Input
                                                value={entry.company}
                                                onChange={(e) => updateExperience(entry.id, 'company', e.target.value)}
                                                placeholder="e.g. Acme Inc."
                                                className="h-10 rounded-xl border-slate-200 bg-white text-sm"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs font-semibold text-slate-600">From</Label>
                                            <Input
                                                value={entry.from_date}
                                                onChange={(e) => updateExperience(entry.id, 'from_date', e.target.value)}
                                                placeholder="e.g. Jan 2020"
                                                className="h-10 rounded-xl border-slate-200 bg-white text-sm"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs font-semibold text-slate-600">
                                                To {entry.is_current && '(Current)'}
                                            </Label>
                                            <Input
                                                value={entry.to_date}
                                                disabled={entry.is_current}
                                                onChange={(e) => updateExperience(entry.id, 'to_date', e.target.value)}
                                                placeholder="e.g. Dec 2022"
                                                className="h-10 rounded-xl border-slate-200 bg-white text-sm disabled:opacity-50"
                                            />
                                        </div>
                                    </div>

                                    <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-500">
                                        <input
                                            type="checkbox"
                                            checked={entry.is_current}
                                            onChange={(e) => updateExperience(entry.id, 'is_current', e.target.checked)}
                                            className="rounded"
                                        />
                                        I currently work here
                                    </label>

                                    <div className="space-y-1">
                                        <Label className="text-xs font-semibold text-slate-600">Description</Label>
                                        <Textarea
                                            value={entry.description}
                                            onChange={(e) => updateExperience(entry.id, 'description', e.target.value.slice(0, 500))}
                                            placeholder="Briefly describe your role..."
                                            className="min-h-[80px] resize-none rounded-xl border-slate-200 bg-white text-sm"
                                        />
                                    </div>
                                </div>
                            ))}

                            <Button
                                type="button"
                                variant="outline"
                                onClick={addExperience}
                                className="h-11 w-full rounded-xl border-2 border-dashed border-slate-200 text-slate-400 hover:border-[#2DAB94] hover:text-[#2DAB94]"
                            >
                                <Plus className="mr-2 h-4 w-4" /> Add Experience
                            </Button>
                        </section>
                    </div>

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
