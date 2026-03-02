import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { UserProvider, useUserState, useUserDispatch } from '../../context/user-context';

// Renders current state as JSON and exposes dispatch via a ref
function TestHarness({ stateRef, dispatchRef }) {
  const state = useUserState();
  const dispatch = useUserDispatch();
  if (stateRef) stateRef.current = state;
  if (dispatchRef) dispatchRef.current = dispatch;
  return <div data-testid="state">{JSON.stringify(state)}</div>;
}

const mockUser = { _id: 'u1', firstName: 'Jane', lastName: 'Doe', email: 'jane@x.com', isLoggedIn: true };

beforeEach(() => {
  localStorage.clear();
});

describe('UserProvider', () => {
  it('renders children', () => {
    render(<UserProvider><span>hello</span></UserProvider>);
    expect(screen.getByText('hello')).toBeInTheDocument();
  });

  it('provides default unauthenticated user when localStorage is empty', () => {
    const stateRef = { current: null };
    render(<UserProvider><TestHarness stateRef={stateRef} /></UserProvider>);
    expect(stateRef.current.user.isLoggedIn).toBe(false);
    expect(stateRef.current.user._id).toBe('');
  });

  it('hydrates state from localStorage on mount', () => {
    localStorage.setItem('user', JSON.stringify(mockUser));
    const stateRef = { current: null };
    render(<UserProvider><TestHarness stateRef={stateRef} /></UserProvider>);
    expect(stateRef.current.user._id).toBe('u1');
    expect(stateRef.current.user.isLoggedIn).toBe(true);
    expect(stateRef.current.user.firstName).toBe('Jane');
  });
});

describe('userReducer — set action', () => {
  it('updates state to the given user payload', () => {
    const stateRef = { current: null };
    const dispatchRef = { current: null };
    render(
      <UserProvider>
        <TestHarness stateRef={stateRef} dispatchRef={dispatchRef} />
      </UserProvider>
    );
    act(() => {
      dispatchRef.current({ type: 'set', payload: mockUser });
    });
    expect(stateRef.current.user._id).toBe('u1');
    expect(stateRef.current.user.firstName).toBe('Jane');
    expect(stateRef.current.user.isLoggedIn).toBe(true);
  });

  it('persists the user to localStorage', () => {
    const dispatchRef = { current: null };
    render(<UserProvider><TestHarness dispatchRef={dispatchRef} /></UserProvider>);
    act(() => {
      dispatchRef.current({ type: 'set', payload: mockUser });
    });
    expect(JSON.parse(localStorage.getItem('user'))).toEqual(mockUser);
  });
});

describe('userReducer — reset action', () => {
  it('resets state to the unauthenticated default', () => {
    localStorage.setItem('user', JSON.stringify(mockUser));
    const stateRef = { current: null };
    const dispatchRef = { current: null };
    render(<UserProvider><TestHarness stateRef={stateRef} dispatchRef={dispatchRef} /></UserProvider>);
    act(() => {
      dispatchRef.current({ type: 'reset' });
    });
    expect(stateRef.current.user.isLoggedIn).toBe(false);
    expect(stateRef.current.user._id).toBe('');
  });

  it('removes user from localStorage', () => {
    localStorage.setItem('user', JSON.stringify(mockUser));
    const dispatchRef = { current: null };
    render(<UserProvider><TestHarness dispatchRef={dispatchRef} /></UserProvider>);
    act(() => {
      dispatchRef.current({ type: 'reset' });
    });
    expect(localStorage.getItem('user')).toBeNull();
  });
});

describe('userReducer — unknown action', () => {
  it('throws an error for unrecognized action types', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const dispatchRef = { current: null };
    render(<UserProvider><TestHarness dispatchRef={dispatchRef} /></UserProvider>);
    expect(() => {
      act(() => {
        dispatchRef.current({ type: 'bogus' });
      });
    }).toThrow('Unhandled action type: bogus');
    consoleSpy.mockRestore();
  });
});

describe('useUserState', () => {
  it('throws when called outside of UserProvider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    function Broken() { useUserState(); return null; }
    expect(() => render(<Broken />)).toThrow('useUserState must be used within a UserProvider');
    consoleSpy.mockRestore();
  });
});

describe('useUserDispatch', () => {
  it('throws when called outside of UserProvider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    function Broken() { useUserDispatch(); return null; }
    expect(() => render(<Broken />)).toThrow('useUserDispatch must be used within a UserProvider');
    consoleSpy.mockRestore();
  });
});
