import { useForm } from '@inertiajs/react';
import { X } from 'lucide-react';
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
        last_name: user?.last_name || '',
        tagline: user?.tagline || '',
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
        post('/profile/update', {
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
                <DialogHeader className="shrink-0 border-b p-6">
                    <DialogTitle className="text-xl font-bold text-slate-900">
                        Edit Profile
                    </DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={submitProfile}
                    className="flex min-h-0 flex-1 flex-col overflow-hidden"
                >
                    {/* Replaced ScrollArea with standard div scroll to fix "Element type invalid" error */}
                    <div className="custom-scrollbar flex-1 space-y-6 overflow-y-auto p-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>First Name</Label>
                                <Input
                                    value={data.name || ''}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Last Name</Label>
                                <Input
                                    value={data.last_name || ''}
                                    onChange={(e) =>
                                        setData('last_name', e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Bio</Label>
                            <Textarea
                                value={data.bio || ''}
                                onChange={(e) => setData('bio', e.target.value)}
                                className="min-h-[100px] resize-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Bio</Label>
                            <Textarea
                                value={data.bio || ''}
                                onChange={(e) => setData('bio', e.target.value)}
                                className="min-h-[100px] resize-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Bio</Label>
                            <Textarea
                                value={data.bio || ''}
                                onChange={(e) => setData('bio', e.target.value)}
                                className="min-h-[100px] resize-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Bio</Label>
                            <Textarea
                                value={data.bio || ''}
                                onChange={(e) => setData('bio', e.target.value)}
                                className="min-h-[100px] resize-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Bio</Label>
                            <Textarea
                                value={data.bio || ''}
                                onChange={(e) => setData('bio', e.target.value)}
                                className="min-h-[100px] resize-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Bio</Label>
                            <Textarea
                                value={data.bio || ''}
                                onChange={(e) => setData('bio', e.target.value)}
                                className="min-h-[100px] resize-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Bio</Label>
                            <Textarea
                                value={data.bio || ''}
                                onChange={(e) => setData('bio', e.target.value)}
                                className="min-h-[100px] resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Role</Label>
                                <Select
                                    value={data.role || ''}
                                    onValueChange={(v) => setData('role', v)}
                                >
                                    <SelectTrigger>
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
                                <Label>Looking For</Label>
                                <Select
                                    value={data.looking_for || ''}
                                    onValueChange={(v) =>
                                        setData('looking_for', v)
                                    }
                                >
                                    <SelectTrigger>
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
                                <Label>Stage</Label>
                                <Select
                                    value={data.business_stage || ''}
                                    onValueChange={(v) =>
                                        setData('business_stage', v)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Idea">
                                            Idea
                                        </SelectItem>
                                        <SelectItem value="MVP">MVP</SelectItem>
                                        <SelectItem value="Scaling">
                                            Scaling
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Skills</Label>
                            <div className="flex flex-wrap gap-2">
                                {data.skills.map((skill: string) => (
                                    <span
                                        key={skill}
                                        className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                                    >
                                        {skill}
                                        <X
                                            className="h-3 w-3 cursor-pointer hover:text-red-500"
                                            onClick={() => removeSkill(skill)}
                                        />
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex shrink-0 justify-end gap-3 border-t p-6">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onClose(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-[#2DAB94] px-6 text-white hover:bg-[#248d7a]"
                        >
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
