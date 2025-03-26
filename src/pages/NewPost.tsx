
import { useState } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { Button } from '@/components/ui/button';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { Calendar, Clock, Image, ArrowLeft, Upload, Instagram, Youtube, Facebook, Linkedin, Twitter } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

type FormValues = {
  title: string;
  content: string;
  platforms: string[];
  schedule: boolean;
};

const NewPost = () => {
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      title: '',
      content: '',
      platforms: ['instagram', 'youtube'],
      schedule: false
    }
  });

  const onSubmit = (data: FormValues) => {
    console.log('Form data:', data);
    
    // In a real app, this would send the data to your Supabase backend
    toast({
      title: "Post created",
      description: "Your post has been successfully scheduled."
    });
  };

  const platformIcons = {
    instagram: <Instagram className="h-5 w-5 text-pink-500" />,
    youtube: <Youtube className="h-5 w-5 text-red-500" />,
    facebook: <Facebook className="h-5 w-5 text-blue-600" />,
    twitter: <Twitter className="h-5 w-5 text-blue-400" />,
    linkedin: <Linkedin className="h-5 w-5 text-blue-700" />
  };

  const handleImageUpload = () => {
    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      setIsUploading(false);
      toast({
        title: "Upload successful",
        description: "Your image has been uploaded."
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <DashboardHeader />
      <main className="flex-1 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="mb-6">
            <Link 
              to="/dashboard" 
              className="flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
            </Link>
            
            <h1 className="text-3xl font-bold">Create New Post</h1>
            <p className="text-muted-foreground mt-1">Schedule content across your platforms</p>
          </div>
          
          <div className="glass-card p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Post Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Add a title for your post" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is for your reference only
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Post Content</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="What do you want to share?" 
                          className="min-h-32"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="border border-border rounded-lg p-4">
                  <h3 className="font-medium mb-3">Add Media</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="h-auto py-4 flex-col items-center justify-center gap-2 border-dashed"
                      onClick={handleImageUpload}
                      disabled={isUploading}
                    >
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <Image className="h-5 w-5" />
                      </div>
                      <span className="text-sm">
                        {isUploading ? 'Uploading...' : 'Upload Image'}
                      </span>
                    </Button>
                    
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="h-auto py-4 flex-col items-center justify-center gap-2 border-dashed"
                    >
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <Upload className="h-5 w-5" />
                      </div>
                      <span className="text-sm">Upload Video</span>
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Select Platforms</h3>
                  <div className="flex flex-wrap gap-3">
                    {['instagram', 'youtube', 'facebook', 'twitter', 'linkedin'].map((platform) => (
                      <FormField
                        key={platform}
                        control={form.control}
                        name="platforms"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(platform)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([...field.value, platform]);
                                  } else {
                                    field.onChange(
                                      field.value?.filter((value) => value !== platform)
                                    );
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="flex items-center cursor-pointer space-x-2">
                              {platformIcons[platform as keyof typeof platformIcons]}
                              <span className="capitalize">{platform}</span>
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>
                
                <FormField
                  control={form.control}
                  name="schedule"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border border-border rounded-lg">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="font-medium flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule for later
                        </FormLabel>
                        <FormDescription>
                          Post will be saved as a draft if unselected
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                {form.watch('schedule') && (
                  <div className="p-4 border border-border rounded-lg bg-muted/50 flex items-center">
                    <Clock className="h-5 w-5 text-muted-foreground mr-2" />
                    <span className="text-sm text-muted-foreground">Scheduling options will appear in the premium plan</span>
                  </div>
                )}
                
                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline">
                    Save as Draft
                  </Button>
                  <Button type="submit">
                    {form.watch('schedule') ? 'Schedule Post' : 'Post Now'}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewPost;
