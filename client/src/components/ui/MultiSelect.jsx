import * as React from 'react';
import { X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Command as CommandPrimitive } from 'cmdk';

function MultiSelect({ OPTIONS = [], DEFAULTS = [] }, ref) {
    const inputRef = React.useRef(null);
    const [open, setOpen] = React.useState(false);
    const [selected, setSelected] = React.useState(DEFAULTS);
    const [inputValue, setInputValue] = React.useState('');

    React.useEffect(() => {
        setSelected(DEFAULTS);
    }, [DEFAULTS]);

    React.useImperativeHandle(ref, () => ({
        getSelectedValues: () => selected,
    }));

    const handleUnselect = React.useCallback((item) => {
        setSelected((prev) => prev.filter((s) => s !== item));
    }, []);

    const handleKeyDown = React.useCallback((e) => {
        const input = inputRef.current;

        if (input) {
            if (e.key === 'Delete' || e.key === 'Backspace') {
                if (input.value === '') {
                    setSelected((prev) => {
                        const newSelected = [...prev];
                        newSelected.pop();
                        return newSelected;
                    });
                }
            }
            if (e.key === 'Escape') {
                input.blur();
            }
        }

        if (e.key === 'Enter' && input.value) {
            const isPresent = selectables.some((item) =>
                item.toLowerCase().includes(input.value.trim().toLowerCase())
            );

            if (!isPresent && input.value) {
                setSelected((prev) => [...prev, input.value.toLowerCase()]);
                inputRef.current.value = '';
                setInputValue('');
            }
        }
    }, []);

    const selectables = OPTIONS.filter((option) => !selected.includes(option));

    return (
        <Command
            onKeyDown={handleKeyDown}
            className="overflow-visible bg-transparent"
        >
            <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                <div className="flex flex-wrap gap-1">
                    {selected.map((option) => {
                        return (
                            <Badge key={option} variant="secondary">
                                {option}
                                <button
                                    className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleUnselect(option);
                                        }
                                    }}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                    onClick={() => handleUnselect(option)}
                                >
                                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                </button>
                            </Badge>
                        );
                    })}
                    {/* Avoid having the "Search" Icon */}
                    <CommandPrimitive.Input
                        ref={inputRef}
                        value={inputValue}
                        onValueChange={setInputValue}
                        onBlur={() => setOpen(false)}
                        onFocus={() => setOpen(true)}
                        placeholder="Select Topics..."
                        className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                    />
                </div>
            </div>
            <div className="relative mt-2">
                <CommandList>
                    {open && selectables.length > 0 ? (
                        <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                            <CommandGroup className="h-full overflow-auto">
                                {selectables.map((option) => {
                                    return (
                                        <CommandItem
                                            key={option}
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                            }}
                                            onSelect={(value) => {
                                                setInputValue('');
                                                setSelected((prev) => [
                                                    ...prev,
                                                    option,
                                                ]);
                                            }}
                                            className={'cursor-pointer'}
                                        >
                                            {option}
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        </div>
                    ) : null}
                </CommandList>
            </div>
        </Command>
    );
}

export default React.forwardRef(MultiSelect);

// import * as React from 'react';
// import { X } from 'lucide-react';

// import { Badge } from '@/components/ui/badge';
// import {
//     Command,
//     CommandGroup,
//     CommandItem,
//     CommandList,
// } from '@/components/ui/command';
// import { Command as CommandPrimitive } from 'cmdk';

// const DEFAULTOPTIONS = [
//     { label: 'React', value: 'react' },
//     { label: 'Vue', value: 'vue' },
//     { label: 'Angular', value: 'angular' },
//     { label: 'Svelte', value: 'svelte' },
//     { label: 'Ember', value: 'ember' },
// ];

// function MultiSelect({ OPTIONS = DEFAULTOPTIONS, DEFAULTS = [] }, ref) {
//     const inputRef = React.useRef(null);
//     const [open, setOpen] = React.useState(false);
//     const [selected, setSelected] = React.useState(DEFAULTS);
//     const [inputValue, setInputValue] = React.useState('');

//     React.useImperativeHandle(ref, () => ({
//         getSelectedValues: () => selected,
//     }));

//     const handleUnselect = React.useCallback((framework) => {
//         setSelected((prev) => prev.filter((s) => s.value !== framework.value));
//     }, []);

//     const handleKeyDown = React.useCallback((e) => {
//         const input = inputRef.current;

//         if (input) {
//             if (e.key === 'Delete' || e.key === 'Backspace') {
//                 if (input.value === '') {
//                     setSelected((prev) => {
//                         const newSelected = [...prev];
//                         newSelected.pop();
//                         return newSelected;
//                     });
//                 }
//             }
//             if (e.key === 'Escape') {
//                 input.blur();
//             }
//         }

//         if (e.key === 'Enter' && input.value) {
//             const isPresent = selectables.some((item) =>
//                 item.label
//                     .toLowerCase()
//                     .includes(input.value.trim().toLowerCase())
//             );

//             if (!isPresent && input.value) {
//                 setSelected((prev) => [
//                     ...prev,
//                     {
//                         label: input.value,
//                         value: input.value.toLowerCase(),
//                     },
//                 ]);
//                 inputRef.current.value = '';
//                 setInputValue('');
//             }
//         }
//     }, []);

//     const selectables = OPTIONS.filter(
//         (framework) => !selected.includes(framework)
//     );

//     return (
//         <Command
//             onKeyDown={handleKeyDown}
//             className="overflow-visible bg-transparent"
//         >
//             <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
//                 <div className="flex flex-wrap gap-1">
//                     {selected.map((framework) => {
//                         return (
//                             <Badge key={framework.value} variant="secondary">
//                                 {framework.label}
//                                 <button
//                                     className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
//                                     onKeyDown={(e) => {
//                                         if (e.key === 'Enter') {
//                                             handleUnselect(framework);
//                                         }
//                                     }}
//                                     onMouseDown={(e) => {
//                                         e.preventDefault();
//                                         e.stopPropagation();
//                                     }}
//                                     onClick={() => handleUnselect(framework)}
//                                 >
//                                     <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
//                                 </button>
//                             </Badge>
//                         );
//                     })}
//                     {/* Avoid having the "Search" Icon */}
//                     <CommandPrimitive.Input
//                         ref={inputRef}
//                         value={inputValue}
//                         onValueChange={setInputValue}
//                         onBlur={() => setOpen(false)}
//                         onFocus={() => setOpen(true)}
//                         placeholder="Select Options..."
//                         className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
//                     />
//                 </div>
//             </div>
//             <div className="relative mt-2">
//                 <CommandList>
//                     {open && selectables.length > 0 ? (
//                         <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
//                             <CommandGroup className="h-full overflow-auto">
//                                 {selectables.map((item) => {
//                                     return (
//                                         <CommandItem
//                                             key={item.value}
//                                             onMouseDown={(e) => {
//                                                 e.preventDefault();
//                                                 e.stopPropagation();
//                                             }}
//                                             onSelect={(value) => {
//                                                 setInputValue('');
//                                                 setSelected((prev) => [
//                                                     ...prev,
//                                                     item,
//                                                 ]);
//                                             }}
//                                             className={'cursor-pointer'}
//                                         >
//                                             {item.label}
//                                         </CommandItem>
//                                     );
//                                 })}
//                             </CommandGroup>
//                         </div>
//                     ) : null}
//                 </CommandList>
//             </div>
//         </Command>
//     );
// }

// export default React.forwardRef(MultiSelect);
