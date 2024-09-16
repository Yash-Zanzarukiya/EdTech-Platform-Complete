import React, { useMemo, useRef } from 'react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from '@/components/ui/card';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
import MultiSelect from '../ui/MultiSelect';
import { useDispatch, useSelector } from 'react-redux';
import { updateCourse } from '@/app/slices/courseSlice';
import { useAllTopics, useCourseDataInstructor } from '@/hooks';

function CourseTopics() {
    useCourseDataInstructor();
    const dispatch = useDispatch();
    const topicsRef = useRef();

    const { loading, courseData } = useSelector(({ course }) => course);

    const courseTopics = useMemo(
        () => courseData?.topics?.map((item) => item.name) || [],
        [courseData]
    );

    const { topicsNames: allTopics } = useAllTopics();

    function onSubmit() {
        const data = topicsRef.current.getSelectedValues();
        
        dispatch(
            updateCourse({
                courseId: courseData._id,
                data: { topics: data.join(',') },
            })
        );
    }

    return (
        <Card x-chunk="dashboard-04-chunk-1" className="p-8">
            <CardHeader>
                <CardTitle className="text-3xl font-bold">
                    Course Topics
                </CardTitle>
                <CardDescription>
                    Used to search and recommend your courses.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <MultiSelect
                    ref={topicsRef}
                    OPTIONS={allTopics}
                    DEFAULTS={courseTopics}
                />
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
                <Button
                    type="submit"
                    disabled={loading}
                    onClick={() => onSubmit()}
                    className="w-36"
                >
                    {loading ? (
                        <>
                            <Loader2 className="size-4 animate-spin mr-2" />
                            Saving...
                        </>
                    ) : (
                        'Save Topics'
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
}

export default CourseTopics;
